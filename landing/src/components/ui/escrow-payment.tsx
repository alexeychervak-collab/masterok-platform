'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  CreditCard,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';

interface EscrowPaymentProps {
  orderId: string;
  orderTitle: string;
  amount: number;
  specialistName: string;
  specialistAvatar?: string;
  clientName: string;
  onPaymentComplete?: () => void;
}

export default function EscrowPayment({
  orderId,
  orderTitle,
  amount,
  specialistName,
  specialistAvatar,
  clientName,
  onPaymentComplete
}: EscrowPaymentProps) {
  const [step, setStep] = useState<'terms' | 'payment' | 'confirmation' | 'success'>('terms');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'yoomoney'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const commission = amount * 0.05; // 5% комиссия
  const totalAmount = amount + commission;

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert('Примите условия безопасной сделки');
      return;
    }

    setIsProcessing(true);
    setStep('payment');

    try {
      // TODO: Интеграция с ЮKassa API
      // 1. Создать платёж через ЮKassa
      // 2. Получить confirmation_url
      // 3. Перенаправить на форму оплаты ЮKassa
      
      // Симуляция платежа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Здесь должна быть реальная интеграция:
      // const response = await fetch('/api/payments/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId,
      //     amount: totalAmount,
      //     description: `Оплата заказа: ${orderTitle}`,
      //     paymentMethod
      //   })
      // });
      // const data = await response.json();
      // window.location.href = data.confirmation_url;

      setStep('confirmation');
      
      // Симуляция подтверждения оплаты
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('success');
      onPaymentComplete?.();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при обработке платежа');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['terms', 'payment', 'confirmation', 'success'].map((s, index) => {
            const isActive = ['terms', 'payment', 'confirmation', 'success'].indexOf(step) >= index;
            return (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}
                    transition-all duration-300
                  `}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2
                      ${isActive ? 'bg-primary-600' : 'bg-gray-200'}
                      transition-all duration-300
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Условия</span>
          <span>Оплата</span>
          <span>Проверка</span>
          <span>Готово</span>
        </div>
      </div>

      {/* Step: Terms */}
      {step === 'terms' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Безопасная сделка
            </h2>
            <p className="text-gray-600">
              Деньги защищены до завершения работы
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Информация о заказе</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Заказ:</span>
                <span className="font-medium text-gray-900">{orderTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Специалист:</span>
                <span className="font-medium text-gray-900">{specialistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Заказчик:</span>
                <span className="font-medium text-gray-900">{clientName}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Стоимость работы:</span>
                  <span className="font-medium text-gray-900">{amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Комиссия сервиса (5%):</span>
                  <span className="font-medium text-gray-900">{commission.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">Итого к оплате:</span>
                  <span className="text-2xl font-bold text-primary-600">{totalAmount.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Как это работает:</h3>
            <div className="space-y-3">
              {[
                {
                  icon: <Lock className="w-5 h-5 text-blue-600" />,
                  title: 'Деньги заблокированы',
                  text: 'После оплаты деньги блокируются на счёте МастерОК'
                },
                {
                  icon: <User className="w-5 h-5 text-purple-600" />,
                  title: 'Специалист работает',
                  text: 'Специалист выполняет работу, зная что оплата гарантирована'
                },
                {
                  icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                  title: 'Вы принимаете работу',
                  text: 'После проверки вы подтверждаете выполнение работы'
                },
                {
                  icon: <DollarSign className="w-5 h-5 text-amber-600" />,
                  title: 'Специалист получает деньги',
                  text: 'После вашего подтверждения деньги переводятся специалисту'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Ваша защита:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• Если специалист не выполнит работу - деньги вернутся вам</li>
                  <li>• Вы можете открыть спор в течение 14 дней</li>
                  <li>• Модерация МастерОК поможет разрешить конфликт</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Я принимаю{' '}
              <a href="/terms-escrow" className="text-primary-600 hover:underline" target="_blank">
                условия безопасной сделки
              </a>{' '}
              и согласен с тем, что деньги будут заблокированы до завершения работы
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handlePayment}
              disabled={!agreedToTerms || isProcessing}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Перейти к оплате
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Выберите способ оплаты
            </h2>
            <p className="text-gray-600">К оплате: {totalAmount.toLocaleString()} ₽</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-8">
            {[
              { id: 'card', label: 'Банковская карта', icon: <CreditCard className="w-5 h-5" /> },
              { id: 'sbp', label: 'Система быстрых платежей (СБП)', icon: <ArrowRight className="w-5 h-5" /> },
              { id: 'yoomoney', label: 'ЮMoney', icon: <DollarSign className="w-5 h-5" /> }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${paymentMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${paymentMethod === method.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  {method.icon}
                </div>
                <span className="font-medium text-gray-900">{method.label}</span>
                {paymentMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Security Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-medium">Безопасность платежа</p>
                <p className="text-green-800 mt-1">
                  Оплата производится через ЮKassa - сертифицированную платёжную систему.
                  Ваши данные надёжно защищены.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                Оплатить {totalAmount.toLocaleString()} ₽
                <Lock className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Step: Confirmation */}
      {step === 'confirmation' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Проверка платежа...
          </h2>
          <p className="text-gray-600">
            Пожалуйста, подождите. Это займёт несколько секунд.
          </p>
        </motion.div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Оплата успешна!
            </h2>
            <p className="text-gray-600 mb-6">
              Деньги заблокированы на счёте МастерОК и будут переведены специалисту после завершения работы
            </p>
          </div>

          {/* Success Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Сумма платежа:</span>
              <span className="font-semibold text-gray-900">{totalAmount.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Заказ:</span>
              <span className="font-medium text-gray-900">{orderTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Специалист:</span>
              <span className="font-medium text-gray-900">{specialistName}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Что дальше?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Специалист получит уведомление об оплате и начнёт работу</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Вы можете общаться с специалистом в чате</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>После выполнения работы подтвердите её завершение</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Деньги будут переведены специалисту</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => window.location.href = `/orders/${orderId}`}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Перейти к заказу
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}




