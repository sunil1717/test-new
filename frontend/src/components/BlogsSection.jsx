import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blogs/getall');
        setBlogs(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const visibleBlogs = showAll ? blogs : blogs.slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 md:px-20 bg-blue-50" id="blog">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">BLOGS HERE</h2>
        {blogs.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-red-600 text-sm font-medium hover:underline"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>

      <hr className="mb-8 border-gray-300" />

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleBlogs.map((post, index) => (
            <div
              key={post._id || index}
              className="bg-white  rounded-xs shadow hover:shadow-md transition duration-300 overflow-hidden flex flex-col"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <Link
                  to={`/blog/${post._id}`}
                  className="text-red-600 font-medium text-sm hover:underline mt-auto"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogsSection;
