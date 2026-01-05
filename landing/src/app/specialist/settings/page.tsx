import { redirect } from 'next/navigation'

export default function SpecialistSettingsPage() {
  // чтобы не было 404 по внутренним ссылкам, ведём в общий раздел настроек
  redirect('/settings')
}




