"""
AI-powered specialist matching service.
Uses weighted multi-factor scoring to recommend the best specialists for an order.
"""

import logging
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.specialist import Specialist, SpecialistSkill
from app.models.order import Order
from app.models.category import Skill
from app.models.service import Service

log = logging.getLogger(__name__)

# Scoring weights
WEIGHTS = {
    "skill_match": 0.40,
    "rating": 0.20,
    "experience": 0.15,
    "availability": 0.10,
    "location": 0.10,
    "price": 0.05,
}


class ScoredSpecialist:
    def __init__(self, specialist: Specialist, score: float, breakdown: dict):
        self.specialist = specialist
        self.score = score
        self.breakdown = breakdown


async def find_matches(
    db: AsyncSession,
    order: Order,
    limit: int = 10,
) -> List[ScoredSpecialist]:
    """
    Find the best matching specialists for an order.
    Returns top N specialists sorted by composite score.
    """
    # Load all available specialists with their skills and services
    stmt = (
        select(Specialist)
        .where(Specialist.is_available == True)
        .options(
            selectinload(Specialist.skills).selectinload(SpecialistSkill.skill),
            selectinload(Specialist.services),
        )
    )
    result = await db.execute(stmt)
    specialists = result.scalars().all()

    if not specialists:
        return []

    # Get order's category from service if available
    order_category_id = None
    order_skill_ids = set()

    if order.service_id:
        svc_result = await db.execute(select(Service).where(Service.id == order.service_id))
        service = svc_result.scalar_one_or_none()
        if service:
            order_category_id = service.category_id if hasattr(service, 'category_id') else None

    # Extract city from order address
    order_city = _extract_city(order.address)

    scored = []
    for spec in specialists:
        # Skip if specialist is assigned to this order already
        if order.specialist_id and order.specialist_id == spec.id:
            continue

        breakdown = {}

        # 1. Skill match (40%)
        breakdown["skill_match"] = _calc_skill_match(spec, order_category_id, order_skill_ids)

        # 2. Rating (20%)
        breakdown["rating"] = min(spec.rating / 5.0, 1.0) if spec.rating else 0.0

        # 3. Experience (15%)
        breakdown["experience"] = _calc_experience_score(spec.experience, order.budget)

        # 4. Availability (10%)
        breakdown["availability"] = _calc_availability_score(spec)

        # 5. Location (10%)
        breakdown["location"] = _calc_location_score(spec.city, order_city)

        # 6. Price (5%)
        breakdown["price"] = _calc_price_score(spec.services, order.budget)

        # Composite score
        total = sum(WEIGHTS[k] * breakdown[k] for k in WEIGHTS)
        scored.append(ScoredSpecialist(spec, round(total * 100, 1), breakdown))

    # Sort by score descending
    scored.sort(key=lambda x: x.score, reverse=True)
    return scored[:limit]


async def recommend_by_params(
    db: AsyncSession,
    category_id: Optional[str] = None,
    budget: Optional[float] = None,
    city: Optional[str] = None,
    limit: int = 10,
) -> List[ScoredSpecialist]:
    """Recommend specialists based on search parameters (not tied to an order)."""
    stmt = (
        select(Specialist)
        .where(Specialist.is_available == True)
        .options(
            selectinload(Specialist.skills).selectinload(SpecialistSkill.skill),
            selectinload(Specialist.services),
        )
    )
    result = await db.execute(stmt)
    specialists = result.scalars().all()

    scored = []
    for spec in specialists:
        breakdown = {}

        # Skill match based on category
        if category_id:
            spec_category_ids = {s.skill.category_id for s in spec.skills if s.skill and hasattr(s.skill, 'category_id')}
            breakdown["skill_match"] = 1.0 if category_id in spec_category_ids else 0.0
        else:
            breakdown["skill_match"] = 0.5

        breakdown["rating"] = min(spec.rating / 5.0, 1.0) if spec.rating else 0.0
        breakdown["experience"] = _calc_experience_score(spec.experience, budget)
        breakdown["availability"] = _calc_availability_score(spec)
        breakdown["location"] = _calc_location_score(spec.city, city)
        breakdown["price"] = _calc_price_score(spec.services, budget)

        total = sum(WEIGHTS[k] * breakdown[k] for k in WEIGHTS)
        scored.append(ScoredSpecialist(spec, round(total * 100, 1), breakdown))

    scored.sort(key=lambda x: x.score, reverse=True)
    return scored[:limit]


def _calc_skill_match(spec: Specialist, category_id: Optional[str], skill_ids: set) -> float:
    """Calculate skill match score."""
    if not category_id and not skill_ids:
        return 0.5  # No category info, neutral score

    spec_category_ids = set()
    spec_skill_ids = set()
    for ss in spec.skills:
        if ss.skill:
            spec_skill_ids.add(ss.skill_id)
            if hasattr(ss.skill, 'category_id'):
                spec_category_ids.add(ss.skill.category_id)

    # Exact skill match
    if skill_ids:
        overlap = len(skill_ids & spec_skill_ids)
        if overlap > 0:
            return min(overlap / len(skill_ids), 1.0)

    # Category match
    if category_id and category_id in spec_category_ids:
        return 0.7

    return 0.0


def _calc_experience_score(experience: int, budget: Optional[float]) -> float:
    """Score experience relative to job complexity (inferred from budget)."""
    if not experience:
        return 0.1

    if budget and budget > 500000:
        # High-budget jobs need experienced specialists
        return min(experience / 15.0, 1.0)
    elif budget and budget > 100000:
        return min(experience / 10.0, 1.0)
    else:
        return min(experience / 5.0, 1.0)


def _calc_availability_score(spec: Specialist) -> float:
    """Score based on availability and response time."""
    score = 1.0 if spec.is_available else 0.0
    # Bonus for fast response time (< 30 min)
    if spec.response_time and spec.response_time < 30:
        score = min(score + 0.2, 1.0)
    elif spec.response_time and spec.response_time > 120:
        score = max(score - 0.3, 0.0)
    return score


def _calc_location_score(spec_city: str, order_city: Optional[str]) -> float:
    """Score based on city match."""
    if not order_city or not spec_city:
        return 0.5

    if spec_city.lower().strip() == order_city.lower().strip():
        return 1.0

    # Known nearby city pairs
    nearby = {
        ("москва", "московская область"), ("москва", "подмосковье"),
        ("санкт-петербург", "ленинградская область"),
    }
    pair = (spec_city.lower().strip(), order_city.lower().strip())
    if pair in nearby or (pair[1], pair[0]) in nearby:
        return 0.6

    return 0.2  # Remote


def _calc_price_score(services, budget: Optional[float]) -> float:
    """Score how well specialist pricing fits the budget."""
    if not budget or not services:
        return 0.5

    avg_price = 0
    count = 0
    for svc in services:
        if hasattr(svc, 'price') and svc.price:
            avg_price += svc.price
            count += 1

    if count == 0:
        return 0.5

    avg_price /= count

    # If specialist average is within reasonable range of budget
    ratio = avg_price / budget if budget > 0 else 1.0
    if 0.5 <= ratio <= 1.5:
        return 1.0
    elif 0.3 <= ratio <= 2.0:
        return 0.6
    else:
        return 0.2


def _extract_city(address: Optional[str]) -> Optional[str]:
    """Extract city name from an address string."""
    if not address:
        return None
    # Simple heuristic: first comma-separated part or known city names
    cities = ["Москва", "Санкт-Петербург", "Казань", "Новосибирск",
              "Екатеринбург", "Краснодар", "Нижний Новгород", "Самара",
              "Ростов-на-Дону", "Уфа", "Красноярск", "Воронеж"]
    for city in cities:
        if city.lower() in address.lower():
            return city
    parts = address.split(",")
    return parts[0].strip() if parts else address
