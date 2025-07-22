import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Calendar, Mail, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronLeft, Copy, Target, MessageSquare, CalendarDays } from 'lucide-react';
import './App.css';

function App() {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // 既存の state の下に追加
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [templateVars, setTemplateVars] = useState({
    companyName: '',
    contactPerson: '',
    productURL: 'https://mindscape-demo.vercel.app',
    senderName: 'M',
    senderPosition: 'Project.M Founder',
    senderEmail: 'm@example.com',
    name: '',
    sentDate: '',
    emailCount: 1,
    status: 'waiting',
    lastResponse: '',
    notes: '',
    strategy: '',
    emails: [],
    nextAction: '',
    nextActionDate: ''
  })

  // ローカルストレージからデータを読み込み
useEffect()= {
    const saved = localStorage.getItem('emailTracker');
    if (saved) {
      setCompanies(JSON.parse(saved));
    } else {
      // サンプルデータ
      const sampleData = [
        {
          id: 1,
          name: 'CultureAmp',
          sentDate: '2025-07-15',
          emailCount: 1,
          status: 'replied',
          lastResponse: 'サポート担当に伝えますの返事あり',
          notes: '',
          strategy: 'エンゲージメント測定の分野でトップ企業。従業員体験の改善に注力している。',
          emails: [
            {
              id: 1,
              date: '2025-07-15',
              subject: 'Proactive wellbeing signals you can\'t see in engagement scores',
              content: 'Hi Culture Amp team,\n\nI\'ve developed a diagnostic tool called Mindscape that surfaces "pre-burnout" signals...',
              response: 'サポート担当に伝えます'
            }
          ],
          nextAction: 'フォローアップメールを送信',
          nextActionDate: '2025-07-25'
        }
      ];
      setCompanies(sampleData);
      localStorage.setItem('emailTracker', JSON.stringify(sampleData));
    }
  }, []);

  // 保存機能
  const saveData = (data) => {
    localStorage.setItem('emailTracker', JSON.stringify(data));
  };

  // GPTテンプレート追加機能
  const addGPTTemplate = (companyId) => {
    const gptTemplate = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      subject: "Re: Unlocking Early Turnover Signals – 2-min demo link inside",
      content: `Hi [Name],

I saw Culture Amp's May roadmap focused on actionable insights and early turnover signals — exactly the space we're tackling with Mindscape.

Quick recap:

🪄 What it does:
Detects pre-burnout and disengagement signals before they show up in engagement scores.

⚙️ How:
20-question pulse check → GPT analysis → instant dashboard + soft alert feed

📈 Impact:
Teams using Mindscape spotted at-risk employees ~14 days earlier and saw a -11% drop in voluntary turnover.

▶ Try the 2-min sandbox here (no login): [Demo Link]

If it's a fit, I'll send over a 3-page brief + offer one of our 3 pilot slots (free, no obligation).

And if the timing's not right — no worries at all. Just ignore this email and I'll close the loop by July 31.

Warm regards,  
M [Your Last Name]  
Founder, Mindscape / Project.M  
[m@yourdomain.com]  |  +81-[Your Phone Number]`,
      response: ''
    };

    const updated = companies.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          emails: [...(company.emails || []), gptTemplate],
          emailCount: company.emailCount + 1
        };
      }
      return company;
    });
    
    setCompanies(updated);
    saveData(updated);
    
    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany(updated.find(c => c.id === companyId));
    }
  };

  // 他の必要な関数...
  const handleSubmit = () => {
    if (!formData.name || !formData.sentDate) return;
    
    if (editingId) {
      const updated = companies.map(company => 
        company.id === editingId ? { ...formData, id: editingId } : company
      );
      setCompanies(updated);
      saveData(updated);
    } else {
      const newCompany = {
        ...formData,
        id: Date.now(),
        emails: []
      };
      const updated = [...companies, newCompany];
      setCompanies(updated);
      saveData(updated);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sentDate: '',
      emailCount: 1,
      status: 'waiting',
      lastResponse: '',
      notes: '',
      strategy: '',
      emails: [],
      nextAction: '',
      nextActionDate: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('クリップボードにコピーしました！');
  };

  // 詳細画面
  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCompany(null)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            ダッシュボードに戻る
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{selectedCompany.name}</h1>

          <div className="bg-white rounded-lg shadow-md border border-purple-200 mb-6">
            <div className="flex border-b border-gray-200">
              {['basic', 'strategy', 'emails', 'actions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium ${
                    activeTab === tab 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-600'
                  }`}
                >
                  {tab === 'basic' && '基本情報'}
                  {tab === 'strategy' && '戦略メモ'}
                  {tab === 'emails' && 'メール履歴'}
                  {tab === 'actions' && '次のアクション'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'emails' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      メール履歴
                    </h3>
                    <button
                      onClick={() => addGPTTemplate(selectedCompany.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      🤖 GPTテンプレ追加
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(selectedCompany.emails || []).map((email, index) => (
                      <div key={email.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">#{index + 1} - {email.date}</h4>
                          <button
                            onClick={() => copyToClipboard(email.content)}
                            className="text-gray-500 hover:text-purple-600 flex items-center gap-1"
                          >
                            <Copy className="w-4 h-4" />
                            コピー
                          </button>
                        </div>
                        <p className="font-medium text-sm text-gray-700 mb-2">件名: {email.subject}</p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{email.content}</pre>
                        </div>
                        {email.response && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">返事:</p>
                            <p className="text-sm text-green-700">{email.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メインダッシュボード
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📧 企業メール追跡ダッシュボード Pro</h1>
          <p className="text-gray-600">GPT連携＋豪華版機能✨</p>
        </div>

        {/* 企業カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg p-6 shadow-md border-2 border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                <button
                  onClick={() => setSelectedCompany(company)}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">送信日: {company.sentDate}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{company.emailCount}回目のメール</span>
                </div>

                {company.lastResponse && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{company.lastResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
