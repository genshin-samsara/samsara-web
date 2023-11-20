import type { GetStaticPaths } from "next";

type StaticProperties = {
  params: StaticPropsParams;
};

type StaticPropsParams = {
  stars: string;
  type: string;
};

const getPathParams = (stars: string, type: string) => {
  return {
    params: {
      stars,
      type,
    },
  };
};

const genshinPaths = [
  getPathParams("5", "characters"),
  getPathParams("5", "weapons"),
  getPathParams("4", "characters"),
  getPathParams("4", "weapons"),
];

const hsrPaths = [
  getPathParams("5", "hsr-characters"),
  getPathParams("5", "lightcones"),
  getPathParams("4", "hsr-characters"),
  getPathParams("4", "lightcones"),
];

const isGenshin = (type: string) => {
  return ["characters", "weapons"].includes(type);
};

const isHsr = (type: string) => {
  return ["hsr-characters", "lightcones"].includes(type);
};

export const getStaticPaths = (async () => {
  return {
    paths: [...genshinPaths, ...hsrPaths],
    fallback: false,
  };
}) satisfies GetStaticPaths;

// This also gets called at build time
export async function getStaticProps({
  params: { stars, type },
}: StaticProperties) {
  return { props: { stars, type } };
}

export default function HistoryPage({ stars, type }: StaticPropsParams) {
  return (
    <>
      Hello, world - {stars} | {type}
    </>
  );
}
