import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { cardData, Card } from '../data/cardData';
import { featureTagData, getAllTags, getCategoryColor } from '../data/featureTagData';
import CardPopupWrapper from './CardPopupWrapper';


const COLORS = [
  'rgb(255 255 255)',   // bg-white
  'rgb(248 250 252)',   // bg-slate-50
  'rgb(241 245 249)',   // bg-slate-100
  'rgb(226 232 240)',   // bg-slate-200
  'rgb(203 213 225)',   // bg-slate-300
  'rgb(148 163 184)',   // bg-slate-400
  'rgb(100 116 139)',   // bg-slate-500
  'rgb(71 85 105)',     // bg-slate-600
  'rgb(51 65 85)',      // bg-slate-700
  'rgb(30 41 59)',      // bg-slate-800
  'rgb(15 23 42)',      // bg-slate-900
  'rgb(2 6 23)',        // bg-slate-950
];

const DataVisualizationDashboard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const allTags = useMemo(() => getAllTags(), []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setAnimationProgress(0);
      const animationDuration = 1000; // 1 second
      const interval = 16; // Approximately 60 fps
      const steps = animationDuration / interval;
      let step = 0;

      const animationTimer = setInterval(() => {
        step++;
        setAnimationProgress(step / steps);
        if (step >= steps) {
          clearInterval(animationTimer);
        }
      }, interval);

      return () => clearInterval(animationTimer);
    }
  }, [isVisible]);

  // 1. Most used tags
  const tagCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    cardData.forEach(card => {
      card.featureTags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => ({ tag, count }));
  }, []);

  // 2. Tag usage bar chart data
  const tagUsageData = useMemo(() => {
    return featureTagData.map(category => ({
      category: category.name,
      data: category.tags.map(tag => ({
        tag,
        count: cardData.filter(card => card.featureTags.includes(tag)).length
      }))
    }));
  }, []);

  // Set the initial selected category
  useEffect(() => {
    if (tagUsageData.length > 0 && !selectedCategory) {
      setSelectedCategory(tagUsageData[0].category);
    }
  }, [tagUsageData, selectedCategory]);

  // 3. Tag category keyword pie charts data
  const categoryKeywordData = useMemo(() => {
    return featureTagData.map(category => {
      const keywordCounts: { [key: string]: number } = {};
      category.tags.forEach(tag => {
        const count = cardData.filter(card => card.featureTags.includes(tag)).length;
        keywordCounts[tag] = count;
      });
      const data = Object.entries(keywordCounts)
        .filter(([_, count]) => count > 0)
        .map(([keyword, count]) => ({
          name: keyword,
          value: count
        }));
      return {
        name: category.name,
        color: category.color,
        data: data.length > 0 ? data : [{ name: 'No data', value: 1 }]
      };
    });
  }, []);

  // 4. Filtered card list
  const filteredCards = useMemo(() => {
    return cardData.filter(card =>
      activeFilters.length === 0 || activeFilters.every(filter => card.featureTags.includes(filter))
    );
  }, [activeFilters]);

  const handleFilterChange = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const CustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}  // Position the label above the bar
        fill={COLORS[9]}
        textAnchor="middle"
        dominantBaseline="bottom"
        fontSize={12}
      >
        {value}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 p-2 rounded shadow">
          <p>{payload[0].payload.tag}</p>
          <p>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleClosePopup = () => {
    setSelectedCard(null);
  };

  return (
    <div className={`fixed inset-0 bg-white overflow-auto transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isAnimating ? 'animate-curtain-down' : ''}`} style={{ zIndex: 30 }}>
      <div className="p-4 max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6">Data Visualization Dashboard</h1>

        {/* 1. Most used tags */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Top 3 Most Used Tags</h2>
          <div className="flex gap-2 justify-around">
            {tagCounts.map(({ tag, count }, index) => (
              <div key={tag} className="grow text-center bg-slate-100 p-3 rounded">
                <div className="text-4xl font-bold">{index + 1}</div>
                <div className="text-lg">{tag}</div>
                <div className="text-sm text-gray-600">Used {count} times</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tag usage bar chart */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Tag Usage</h2>
          <div className="flex justify-center mb-4">
            {tagUsageData.map(category => (
              <button
                key={category.category}
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedCategory === category.category ? 'bg-slate-500 text-white' : 'bg-slate-200'
                }`}
                onClick={() => setSelectedCategory(category.category)}
              >
                {category.category}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagUsageData.find(c => c.category === selectedCategory)?.data || []}>

              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill={COLORS[5]}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey="tag"
                  content={<CustomBarLabel />}
                  position="top"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* 3. Tag category keyword pie charts */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Tag Categories and Keywords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {categoryKeywordData.map((category, categoryIndex) => (
              <div key={category.name} className="bg-slate-100 p-4 rounded">
                <h3 className="text-m text-center font-semibold mb-2" style={{ color: COLORS[categoryIndex + 4] }}>{category.name}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={category.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {category.data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[(index + categoryIndex) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Filtered card list */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Card List</h2>
          <ul className="space-y-2">
            {filteredCards.map(card => (
              <li
                key={card.id}
                className="bg-slate-100 p-4 rounded cursor-pointer hover:bg-slate-200 flex justify-between items-center"
                onClick={() => handleCardClick(card)}
              >
                <span className="font-semibold">{card.name}</span>
                <div className="flex flex-wrap gap-1">
                  {card.featureTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: getCategoryColor(tag) || COLORS[9] }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {selectedCard && (
        <CardPopupWrapper 
          card={selectedCard}
          onClose={handleClosePopup}
        />
      )}
      </div>
    </div>
  );
};

export default DataVisualizationDashboard;