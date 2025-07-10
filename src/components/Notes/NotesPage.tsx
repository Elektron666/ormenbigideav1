import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, BookOpen, Crown, Zap } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'motivation' | 'business' | 'personal' | 'goals';
  createdAt: Date;
  updatedAt: Date;
}

const categoryConfig = {
  motivation: { label: 'Motivasyon', icon: Zap, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  business: { label: 'İş', icon: Crown, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  personal: { label: 'Kişisel', icon: BookOpen, color: 'bg-green-100 text-green-600 border-green-200' },
  goals: { label: 'Hedefler', icon: Crown, color: 'bg-purple-100 text-purple-600 border-purple-200' },
};

export function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('ormen_notes', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'motivation' as Note['category'],
  });

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...formData, updatedAt: new Date() }
          : note
      ));
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setFormData({ title: '', content: '', category: 'motivation' });
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', category: 'motivation' });
    setIsEditing(false);
    setEditingNote(null);
  };

  const inspirationalPlaceholders = {
    motivation: "Bugün kendime şunu hatırlatmak istiyorum...\n\n🦁 Aslan gibi güçlüyüm ve cesurca ilerliyorum\n🐅 Kaplan gibi kararlıyım ve hedefime odaklanıyorum\n⚡ Her zorluk beni daha güçlü yapıyor\n👑 Ben bir savaşçıyım, pes etmem!\n🔥 İçimdeki ateş hiç sönmeyecek",
    business: "İş hedeflerim ve stratejilerim...\n\n🦁 Aslan gibi liderlik yapacağım\n🐅 Kaplan gibi fırsatları yakalayacağım\n📈 Bu ay ulaşmak istediğim hedefler\n💼 Yeni fırsatlar\n🎯 Odaklanmam gereken alanlar",
    personal: "Kişisel gelişim notlarım...\n\n🦁 Aslan gibi kendime güveniyorum\n🐅 Kaplan gibi disiplinliyim\n🌱 Bugün öğrendiğim yeni şey\n💪 Geliştirmek istediğim özellikler\n🙏 Minnettar olduğum şeyler",
    goals: "Hedeflerim ve planlarım...\n\n🦁 Aslan gibi büyük hedefler koyuyorum\n🐅 Kaplan gibi sabırla çalışıyorum\n🎯 Kısa vadeli hedefler\n🚀 Uzun vadeli vizyonum\n📋 Yapılacaklar listesi"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notlarım</h2>
          <p className="text-gray-600 mt-1">Aslanlı, kaplanlı, motive edici notlar</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Not</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingNote ? 'Not Düzenle' : 'Yeni Not Ekle'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Notunuza bir başlık verin..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: key as Note['category'] }))}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                        formData.category === key
                          ? config.color
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={inspirationalPlaceholders[formData.category]}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>İptal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => {
          const config = categoryConfig[note.category];
          const Icon = config.icon;
          
          return (
            <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{note.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-4 mb-4 whitespace-pre-wrap">{note.content}</p>
              
              <div className="text-xs text-gray-500">
                {new Date(note.updatedAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          );
        })}
      </div>

      {notes.length === 0 && !isEditing && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <div className="text-4xl">🦁</div>
            <div className="absolute -bottom-1 -right-1 text-3xl">🐅</div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz aslanlı not yok! 🦁</h3>
          <p className="text-gray-600 mb-6">İlk kaplanlı motivasyon notunuzu ekleyerek başlayın! 🐅</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg transform hover:scale-105"
          >
            <span className="text-lg">🦁</span>
            <span>İlk Aslanlı Notunu Ekle</span>
            <span className="text-lg">🐅</span>
          </button>
        </div>
      )}
    </div>
  );
}