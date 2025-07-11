// import { useState } from 'react';
// import axios from 'axios';

// export default function App() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:8000/api/blogs/search?q=${encodeURIComponent(query)}`);
//       setResults(res.data.results || []);
//     } catch (err) {
//       console.error('Search failed', err);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">🧠 Personal Blog Search</h1>
//         <div className="flex gap-2 mb-6">
//           <input
//             type="text"
//             className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Search for authentic blogs..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//         </div>

//         {loading && <p className="text-center text-gray-600">Searching...</p>}

//         {!loading && results.length > 0 && (
//           <ul className="space-y-4">
//             {results.map((item, idx) => (
//               <li key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200">
//                 <a
//                   href={item.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-xl font-semibold text-blue-700 hover:underline"
//                 >
//                   {item.title}
//                 </a>
//                 <p className="text-gray-600 mt-1">{item.snippet}</p>
//                 <p className="text-sm text-gray-400 mt-1">{item.domain}</p>
//               </li>
//             ))}
//           </ul>
//         )}

//         {!loading && results.length === 0 && query.trim() && (
//           <p className="text-center text-gray-500">No results found. Try a different query.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/blogs/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error('Search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">🔍 Personal Blog Search</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for insightful personal blogs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Searching...</p>}

        {!loading && results.length > 0 && (
          <ul className="space-y-5">
            {results.map((item, idx) => (
              <li
                key={idx}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-semibold text-blue-700 hover:underline break-words"
                >
                  {item.title}
                </a>

                <div className="mt-2 max-h-40 overflow-y-auto">
                  <p className="text-gray-700 text-sm whitespace-pre-line break-words">
                    {item.snippet}
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-2">{item.domain}</p>
              </li>
            ))}
          </ul>
        )}

        {!loading && results.length === 0 && query.trim() && (
          <p className="text-center text-gray-500 mt-4">No results found. Try a different query.</p>
        )}
      </div>
    </div>
  );
}
