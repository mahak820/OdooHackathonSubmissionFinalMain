// app/components/reusable/Header.jsx

export default function Header({ title, subtitle }) {
  return (
    <header className="bg-gray-800 text-white text-center py-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
    </header>
  );
}