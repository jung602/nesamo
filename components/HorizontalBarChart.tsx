import React from 'react';
import { motion } from 'framer-motion';

const HorizontalBarChart = ({ data, maxValue }) => {
  return (
    <div className="space-y-3 bg-white p-2 my-4 rounded-md border">
      {data.map((item, index) => (
        <div key={item.tag} className="flex items-center m-2">
          <div className="relative flex-grow h-8 rounded overflow-hidden">
            <div className="absolute top-1/2 -translate-y-1/2 ml-2 text-white">{item.tag}</div>
              <motion.div
                className="h-full bg-slate-900 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
            <div className="ml-2 text-center text-slate-900">{item.count}</div>

        </div>
      ))}
    </div>
  );
};

export default HorizontalBarChart;