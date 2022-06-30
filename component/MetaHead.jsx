import Head from "next/head";
import URI from "urijs";
import { useCmsContext } from "context/Cms";

const useMetaHead = () => {
  const {
    url,
    app: { name, logo },
    page: { id, title, description, keywords, updatedAt, image, index }
  } = useCmsContext();

  if (!id) {
    return {
      title: "Page Not Found",
      descriptionDisplay: "Page Not Found",
      index: false
    };
  }

  let descriptionDisplay = description ? description : undefined;
  if (descriptionDisplay && descriptionDisplay.length > 160) descriptionDisplay = description.substring(0, 157) + "...";

  const origin = url ? new URI(url).origin() : undefined;
  const canonical = url;
  const imageUrl = image?.formats?.medium?.url || image?.thumbnail?.url;

  const siteName = `Web ${name}`;

  const dataJSON = origin
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${origin}/#organization`,
            name,
            url: `${origin}/`,
            sameAs: [],
            logo: {
              "@type": "ImageObject",
              "@id": `${origin}/#logo`,
              url: logo.url,
              caption: name
            },
            image: { "@id": `${origin}/#logo` }
          },
          {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            url: `${origin}/`,
            name: siteName,
            publisher: { "@id": `${origin}/#organization` }
          },
          {
            "@type": "ImageObject",
            "@id": `${origin}/#primaryimage`,
            url: imageUrl
          },
          {
            "@type": "WebPage",
            "@id": `${origin}/#webpage`,
            url,
            name: title,
            isPartOf: { "@id": `${origin}/#website` },
            primaryImageOfPage: {
              "@id": `${origin}/#primaryimage`
            },
            dateModified: updatedAt
          }
        ]
      })
    : undefined;

  return {
    title,
    index,
    canonical,
    siteName,
    keywords,
    descriptionDisplay,
    image,
    updatedAt,
    dataJSON
  };
};

export default function MeteHead() {
  const { title, index, canonical, siteName, keywords, descriptionDisplay, image, updatedAt, dataJSON } = useMetaHead();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content={index ? "index" : "noindex"} />

      {index && (
        <>
          {canonical ? <link rel="canonical" href={canonical} /> : null}
          <meta property="og:locale" content="en_GB" />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={siteName} />
          {keywords ? <meta name="keywords" content={keywords} /> : null}
          {descriptionDisplay && (
            <>
              <meta name="description" content={descriptionDisplay} />
              <meta property="og:description" content={descriptionDisplay} />
              <meta name="twitter:description" content={descriptionDisplay} />
            </>
          )}
          {image && (
            <>
              <meta property="og:image" itemProp="image" content={image} />
              <meta property="og:image:secure_url" itemProp="image" content={image} />
              <meta property="og:image:alt" content={title} />
              <meta name="twitter:image" content={image} />
            </>
          )}
          <meta property="og:updated_time" content={updatedAt} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          {dataJSON && (
            <script type="application/ld+json" className="structured-data-list">
              {dataJSON}
            </script>
          )}
        </>
      )}

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/icon/favicon.ico" />
      <link rel="shortcut icon" href="/icon/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}
