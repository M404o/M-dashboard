import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Calendar, Mail, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronLeft, Copy, Target, MessageSquare, CalendarDays } from 'lucide-react';
import './App.css';

function App() {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  const [formData, setFormData] = useState({
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

  const [templateVars, setTemplateVars] = useState({
    companyName: '',
    contactPerson: '',
    productURL: 'https://mindscape-demo.vercel.app',
    senderName: 'M',
    senderPosition: 'Project.M Founder',
    senderEmail: 'm@example.com'
  });

  // GPTの6つのテンプレート
  const emailTemplates = [
    {
      id: 1,
      title: "①Icebreaker型",
      type: "カジュアル・会話導入型",
      description: "相手の投稿やWebから入る自然な導入。興味を引く一言付き。",
      content: `Hi \${templateVars.contactPerson || '[担当者名]'},

I came across \${templateVars.companyName || '[企業名]'}'s recent work on employee engagement and was impressed by your data-driven approach.

I've been developing Mindscape, a diagnostic tool that surfaces pre-burnout signals before they appear in traditional engagement scores. Given \${templateVars.companyName || '[企業名]'}'s focus on actionable insights, I thought it might be relevant.

Would you be open to a brief conversation about how this might complement your current approach?

Best regards,
\${templateVars.senderName}
\${templateVars.senderPosition}
\${templateVars.senderEmail}`
    },
    {
      id: 2,
      title: "②Problem-aware型",
      type: "課題前提の提案型",
      description: "相手の課題を前提にした提案アプローチ",
      content: `Dear \${templateVars.contactPerson || '[担当者名]'},

\${templateVars.companyName || '[企業名]'} has built an impressive platform for measuring employee engagement. However, I understand that traditional engagement surveys often miss early warning signs of burnout and disengagement.

Mindscape addresses this gap by detecting pre-burnout signals through a 20-question diagnostic that reveals patterns engagement scores typically miss.

Early results show teams using this approach identify at-risk employees ~14 days earlier and see an 11% improvement in retention.

I'd love to explore how this might strengthen \${templateVars.companyName || '[企業名]'}'s existing capabilities.

Warm regards,
\${templateVars.senderName}
\${templateVars.senderPosition}`
    }
  ];

  // サンプルデータの読み込み
  useEffect(() => {
    const saved = localStorage.getItem('emailTracker');
    if (saved) {
      setCompanies(JSON.parse(saved));
    } else {
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

  const saveData = (data) => {
    localStorage.setItem('emailTracker', JSON.stringify(data));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  // シンプルなダッシュボード
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📧 企業メール追跡ダッシュボード Pro</h1>
          <p className="text-gray-600">Lucide アイコン + GPT テンプレ機能✨</p>
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
                <button className="text-gray-400 hover:text-purple-600 transition-colors">
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

        {/* コピー通知 */}
        {showCopyNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
            ✅ コピーしました！
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
