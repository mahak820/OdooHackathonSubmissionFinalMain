// app/components/reusable/BlogCard.jsx
import Link from 'next/link';

export default function BlogCard({ blog }) {
  const postDate = new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col relative">
      <h2 className="text-2xl font-bold text-gray-800 text-center">{blog.title}</h2>
      <p className="mt-2 text-sm text-gray-500 text-center">
        <em>by {blog.author} on {postDate}</em>
      </p>
      <p className="mt-1 text-md text-gray-600 text-center">
        <strong>Sport:</strong> {blog.sport}
      </p>
      <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
    </div>
  );
}