import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Heart, Star, Zap } from 'lucide-react';

const senecaQuotes = [
  "Hayat uzun değildir, onu uzun yapmayı bilmiyoruz.",
  "Her yeni başlangıç, bir önceki başlangıcın sonundan doğar.",
  "Şans, hazırlığın fırsatla buluşmasıdır.",
  "Korkularımız her zaman umutlarımızdan daha fazladır.",
  "Zaman en değerli şeydir, çünkü geri alınamaz.",
  "Büyük işler cesaret, güç ve kararlılık gerektirir.",
  "Bilgelik, tecrübenin kızıdır.",
  "İnsan ne kadar az şeye ihtiyaç duyarsa, o kadar mutludur.",
];

const marcusQuotes = [
  "Sen bugün ne yapacaksan, yarın da yapabilirsin. Ama bugün yapmazsan, yarın da yapmayacaksın.",
  "Kontrolün altında olan şeylere odaklan, kontrolün dışında olanlara değil.",
  "Her sabah kendine şunu söyle: Bugün huysuz, nankör, kibirli insanlarla karşılaşacağım.",
  "Geçmişe üzülme, geleceği merak etme. Şimdiki ana odaklan.",
  "Engel yol haline gelir. Yol engel haline gelir.",
  "Düşüncelerini kontrol et, çünkü onlar karakterini şekillendirir.",
  "Mükemmellik bir hedeftir, mükemmelleşme ise bir süreçtir.",
  "Sabah kalktığında, bugün yapacağın işi düşün ve ona göre hareket et.",
];

export function MotivationPage() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [quoteType, setQuoteType] = useState<'seneca' | 'marcus'>('seneca');

  const getRandomQuote = (type: 'seneca' | 'marcus') => {
    const quotes = type === 'seneca' ? senecaQuotes : marcusQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setCurrentAuthor(type === 'seneca' ? 'Seneca' : 'Marcus Aurelius');
    setQuoteType(type);
  };

  useEffect(() => {
    getRandomQuote('seneca');
  }, []);

  const motivationalTips = [
    {
      icon: Zap,
      title: "Günlük Hedefler",
      description: "Her gün küçük ama anlamlı hedefler koy ve bunları gerçekleştir.",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Heart,
      title: "Kendine İyi Davran",
      description: "Başarısızlıkları öğrenme fırsatı olarak gör, kendini yargılama.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Star,
      title: "İlerlemeyi Kutla",
      description: "Küçük başarıları da kutlamayı unutma, her adım değerlidir.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Sürekli Öğren",
      description: "Her gün yeni bir şey öğrenmeye çalış, gelişim hiç durmasın.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Motivasyon Merkezi</h2>
        <p className="text-gray-600">Seneca ve Marcus Aurelius'tan ilham verici sözler</p>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="text-center">
          <div className="text-6xl text-blue-200 mb-4">"</div>
          <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-6 leading-relaxed">
            {currentQuote}
          </blockquote>
          <cite className="text-lg font-semibold text-blue-600">— {currentAuthor}</cite>
        </div>
        
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => getRandomQuote('seneca')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              quoteType === 'seneca'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Seneca
          </button>
          <button
            onClick={() => getRandomQuote('marcus')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              quoteType === 'marcus'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            Marcus Aurelius
          </button>
          <button
            onClick={() => getRandomQuote(quoteType)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* Motivational Tips */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Günlük Motivasyon İpuçları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {motivationalTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Affirmation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Günlük Olumlamalar</h3>
          <div className="space-y-3 text-lg text-gray-700">
            <p>✨ Bugün harika işler başaracağım</p>
            <p>🚀 Her zorluk beni daha güçlü yapıyor</p>
            <p>🌟 Başarı için gerekli tüm kaynaklara sahibim</p>
            <p>💪 Kararlılığım ve azimim sınırsız</p>
            <p>🎯 Hedeflerime odaklanıyorum ve başarıyorum</p>
          </div>
        </div>
      </div>
    </div>
  );
}