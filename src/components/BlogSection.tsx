'use client';

export default function BlogSection() {
  const blogPosts = [
    {
      title: "Duis nonummy socios mattis tempus penatibus",
      category: "Tours & Travel",
      date: "20 Oct",
      comments: 0,
      author: "admin",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Litora phasellus in phasellus curabitur porta eun",
      category: "Tours & Travel", 
      date: "20 Oct",
      comments: 0,
      author: "admin",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Mattis parturent tortor lectus lestie sapien Dapus",
      category: "Tours & Travel",
      date: "20 Oct", 
      comments: 0,
      author: "admin",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Articles</h2>
          <h3 className="text-2xl text-gray-600">Every Single Journal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-sm opacity-90">Blog Post</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-3">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
                  {post.title}
                </h4>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.comments} Comment</span>
                  <span>By {post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            View Blog
          </button>
        </div>
      </div>
    </section>
  );
}
