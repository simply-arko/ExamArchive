import { FaNetworkWired } from 'react-icons/fa6';
import { FaDatabase, FaLinux } from 'react-icons/fa';
import { Highlight } from '@/components/ui/hero-highlight';
import { HoverEffect } from '@/components/ui/card-hover-effect';

export const cards = [
  {
    title: 'Operating systems',
    description:
      'Discover our comprehensive collection of papers on operating systems, featuring in-depth insights.',
    link: 'https://pornhub.com',
    icon: <FaLinux className="text-3xl" />,
    aosDelay: 300,
  },
  {
    title: 'Networking',
    description:
      'A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    link: 'https://pornhub.com',
    icon: <FaNetworkWired className="text-3xl" />,
    aosDelay: 400,
  },
  {
    title: 'DBMS',
    description:
      'A multinational technology company that develops, manufactures, licenses, ',
    link: 'https://pornhub.com',
    icon: <FaDatabase className="text-3xl" />,
    aosDelay: 500,
  },
];

export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-4 leading-snug">
              The majority of students don&apos;t understand exactly{' '}
              <Highlight className="px-2">what to study?</Highlight>
            </h2>
          </div>
          {/* Items */}
          <div
            className="max-w-sm mx-auto items-start md:max-w-2xl lg:max-w-none"
            data-aos-id-blocks
          >
            <HoverEffect items={cards} />
          </div>
        </div>
      </div>
    </section>
  );
}
