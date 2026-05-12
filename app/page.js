import dynamic from 'next/dynamic';

const SeatCanvas = dynamic(() => import('../components/workspace/SeatCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <SeatCanvas />
    </main>
  );
}
