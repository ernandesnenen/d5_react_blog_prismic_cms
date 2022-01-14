import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Prismic from '@prismicio/client';

import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  function readTime(): number {
    const { content } = post.data;
    let text0 = '';

    const text = content.reduce((valorAnterior, valorAtual) => {
      text0 = `${valorAnterior.heading} ${valorAtual.heading} ${RichText.asText(
        valorAnterior.body
      )} ${RichText.asText(valorAtual.body)}`;

      return text0;
    });

    const texto = text.toString().split(' ');
    const timeExpect =
      texto.length % 200 > 0
        ? Math.trunc(texto.length / 200) + 1
        : texto.length / 200;
    return Number(timeExpect);
  }

  const router = useRouter();
  if (router.isFallback) {
    return (
      <>
        <Head>
          <title> Aguarde... | spacetraveling</title>
        </Head>
        <main className={commonStyles.pageContainer}>
          <span className={styles.loadingWarning}>Carregando...</span>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title> Post | spacetraveling</title>
      </Head>
      <main className={styles.mainContent}>
        <img src={post.data.banner.url} alt="banner" />
        <article className={`${commonStyles.contentContainer}`}>
          <div className={styles.infoArticle}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.info}>
              <time>
                <FiCalendar className={commonStyles.calendarIcone} />
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
              <span>
                <FiUser className={commonStyles.userIcone} />
                {post.data.author}
              </span>
              <time>{`${readTime()} min`}</time>
            </div>
          </div>
          <div className={styles.contentArticle}>
            {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: response.data,
    uid: response.uid,
  };

  return {
    props: {
      post,
    },
  };
};
