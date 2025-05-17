"use client";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  image: string;
  content: string;
  createdAt?: { toMillis: () => number };
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogList: Blog[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[];

        blogList.sort(
          (a, b) => (b?.createdAt?.toMillis?.() || 0) - (a?.createdAt?.toMillis?.() || 0)
        );

        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h2>

      {loading ? (
        <p className="text-center">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link href={`/blog/${blog.id}`} key={blog.id}>
              <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{blog.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
