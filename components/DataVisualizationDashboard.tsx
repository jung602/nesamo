import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { cardData, Card } from '../data/cardData';
import { featureTagData, getAllTags, getCategoryColor } from '../data/featureTagData';
import CardPopup from './CardPopup';
import Filter from './Filter';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DataVisualizationDashboard: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const allTags = useMemo(() => getAllTags(), []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); // Animation duration
      return () => clearTimeout(timer);
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
    return allTags.map(tag => ({
      tag,
      count: cardData.filter(card => card.featureTags.includes(tag)).length
    }));
  }, [allTags]);

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

  return (
    <div className={`fixed inset-0 bg-white overflow-auto transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isAnimating ? 'animate-curtain-down' : ''}`} style={{ zIndex: 30 }}>
      <div className="p-4 max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6">Data Visualization Dashboard</h1>
        

      {/* 1. Most used tags */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top 3 Most Used Tags</h2>
        <div className="flex justify-around">
          {tagCounts.map(({ tag, count }, index) => (
            <div key={tag} className="text-center">
              <div className="text-4xl font-bold">{index + 1}</div>
              <div className="text-lg">{tag}</div>
              <div className="text-sm text-gray-600">Used {count} times</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Tag usage bar chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tag Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tagUsageData}>
            <XAxis dataKey="tag" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 3. Tag category keyword pie charts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tag Categories and Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryKeywordData.map((category) => (
            <div key={category.name} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2" style={{ color: category.color }}>{category.name}</h3>
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
                  >
                    {category.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      <section>
        <h2 className="text-2xl font-semibold mb-4">Card List</h2>
        <Filter
          featureTags={featureTagData}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
        <ul className="space-y-2">
          {filteredCards.map(card => (
            <li
              key={card.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedCard(card)}
            >
              <span className="font-semibold">{card.name}</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {card.featureTags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs text-white"
                    style={{ backgroundColor: getCategoryColor(tag) || '#999' }}
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
        <CardPopup card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
    </div>
  );
};

export default DataVisualizationDashboard;