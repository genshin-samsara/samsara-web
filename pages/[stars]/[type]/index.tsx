import type { GetStaticPaths } from "next";

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          stars: "123",
          type: "abc",
        },
      },
      {
        params: {
          stars: "5s",
          type: "characters",
        },
      },
    ],
    fallback: true, // false or "blocking"
  };
}) satisfies GetStaticPaths;

// This also gets called at build time
export async function getStaticProps({ params }) {
  return { props: { stars: params.stars, type: params.type } };
}

export default function HistoryPage({ stars, type }) {
  return (
    <>
      Hello, world - {stars} | {type}
    </>
  );
}
