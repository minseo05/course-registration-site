const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'course', label: '수강신청' },
  { id: 'preCart', label: '사전 신청함' },
  { id: 'check', label: '신청 확인' },
  { id: 'timetable', label: '시간표' },
];

export default function TabMenu({ activeTab, onChange }) {
  return (
    <nav className="tab-menu" aria-label="메인 기능 탭">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'tab active' : 'tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
