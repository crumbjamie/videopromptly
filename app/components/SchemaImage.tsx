'use client';

import Image from 'next/image';
import Script from 'next/script';
import { generateImageObjectSchema } from '@/lib/seo';

interface SchemaImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  schemaId?: string;
}

export default function SchemaImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  quality,
  sizes,
  schemaId
}: SchemaImageProps) {
  const imageSchema = generateImageObjectSchema(src, alt, width, height);
  const uniqueId = schemaId || `image-schema-${src.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <>
      <Script
        id={uniqueId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
        strategy="afterInteractive"
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes}
      />
    </>
  );
}