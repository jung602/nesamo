import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { cardData, Card } from '../data/cardData';
import { featureTagData, getAllTags, getCategoryColor } from '../data/featureTagData';
import CardPopupWrapper from './CardPopupWrapper';
import HorizontalBarChart from './HorizontalBarChart'

const COLORS = [
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isCurtainDown, setIsCurtainDown] = useState(false);

  const allTags = useMemo(() => getAllTags(), []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      setIsCurtainDown(true);
      setIsContentVisible(false);
      timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 500); // 커튼 애니메이션이 끝난 후 컨텐츠를 보이게 함
    } else {
      setIsContentVisible(false);
      timer = setTimeout(() => {
        setIsCurtainDown(false);
      }, 300); // 컨텐츠가 사라진 후 커튼을 올림
    }
    return () => clearTimeout(timer);
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
      })).sort((a, b) => b.count - a.count) // Sort by count in descending order
    }));
  }, []);

  const maxTagCount = useMemo(() => {
    return Math.max(...tagUsageData.flatMap(category => category.data.map(item => item.count)));
  }, [tagUsageData]);

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
        x={x + width + 5}
        y={y + 15}
        fill={COLORS[9]}
        textAnchor="start"
        dominantBaseline="middle"
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
    <div className={`fixed inset-0 bg-white overflow-auto transition-all duration-500 ${
      isCurtainDown ? 'translate-y-0' : '-translate-y-full'
    } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    style={{ zIndex: 50 }}
    >
      <div className={`p-4 max-w-7xl mx-auto pt-20 transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>

        <h1 className="text-xl font-bold mb-6">To All The Boys I've Loved Before</h1>
        <p className="text-s mb-12 w-1/2 max-lg:w-full">Inspired by the Netflix movie To All the Boys I've Loved Before, this site is my personal archive of all the virtual guys who've ever caught my eye. Think of it as a digital lineup of my fictional crushes, laid out like model Polaroids for your viewing pleasure.
        <br /> Each character is tagged with their looks, social background, and personality traits. I've even put together some data visualizations to analyze my taste—turns out I've got a type, and I'm not ashamed to admit it.
        <br /> What started as a bit of a joke has turned into a full-on collection. Dive in if you're curious, but no promises you'll come out the same.</p>

        {/* 1. Most used tags */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Ultimate Bias</h2>
          <div className="flex gap-2 justify-around">
            {tagCounts.map(({ tag, count }, index) => (
              <div key={tag} className="grow text-center bg-slate-100 p-3 rounded">
                <div className="text-sm font-bold">{index + 1}</div>
                <div className="text-lg">{tag}</div>
                <div className="text-3xl font-handwriting text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tag usage bar chart */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Taste Rank</h2>
          <div className="text-sm flex justify-center mb-4">
            {tagUsageData.map(category => (
              <button
                key={category.category}
                className={`px-2 py-1 rounded-md mr-2 ${
                  selectedCategory === category.category ? 'bg-slate-900 text-white' : 'bg-slate-100 border'
                }`}
                onClick={() => setSelectedCategory(category.category)}
              >
                {category.category}
              </button>
            ))}
          </div>
          <HorizontalBarChart 
            data={tagUsageData.find(c => c.category === selectedCategory)?.data || []}
            maxValue={maxTagCount}
          />
        </section>

        {/* 3. Tag category keyword pie charts */}
        <section className="mb-8 rounded-md bg-slate-50 p-3">
          <h2 className="text-xl text-center font-semibold mb-4">Taste Stats</h2>
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
        <section className="mb-8 rounded-md p-3">
          <h2 className="text-xl text-center font-semibold mb-4 text-slate-500 p-2 border-slate-200 border-b">Data List</h2>
          <ul className="space-y-3">
            {filteredCards.map(card => (
              <li
                key={card.id}
                className="bg-slate-50 shadow-lg shadow-slate-100 p-4 border border-slate-200 rounded cursor-pointer flex justify-between items-center hover:bg-slate-100 hover:shadow-slate-200"
                onClick={() => handleCardClick(card)}
              >
                <span className="font-semibold">{card.name}</span>
                <div className="flex flex-wrap gap-1">
                  {card.featureTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-slate-900 text-white"
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