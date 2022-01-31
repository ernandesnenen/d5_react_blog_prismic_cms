import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';
// import { getPrismicClient } from '../services/prismic';
import { Client } from '../utils/prismicHelpers.js';
import { ExitPreviewButton } from '../components/ExitPreviewButton';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [posts, setPost] = useState(postsPagination.results);
  const [nextsPage, setNextPage] = useState(postsPagination.next_page);

  async function handleMaisposts(): Promise<void> {
    const postsResponse = await (await fetch(`${nextsPage}`)).json();

    setNextPage(postsResponse.next_page);
    const newPosts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });
    return setPost([...posts, ...newPosts]);
  }
  return (
    <>
      <Head>
        <title> Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <div className={styles.contentContent}>
          {posts.map(post => {
            return (
              <div key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <a>
                    <strong>{post.data.title}</strong>
                    <p>{post.data.subtitle}</p>
                    <div className={commonStyles.info}>
                      <FiCalendar className={commonStyles.calendarIcone} />
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          { locale: ptBR }
                        )}
                      </time>
                      <span>
                        <FiUser className={commonStyles.userIcone} />
                        {post.data.author}
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
          {nextsPage !== null ? (
            <button type="button" onClick={handleMaisposts}>
              Carregar mais posts
            </button>
          ) : (
            ''
          )}
          {preview && <ExitPreviewButton className={styles.exitPreview} />}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData = null,
}) => {
  console.log(previewData);
  // const prismic = getPrismicClient();
  const prismic = Client();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'next_page'],
      pageSize: 2,
      // isso foi tirado do exemplo
      ref: previewData?.ref ?? null,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
      // isso foi tirado do exemplo
      preview,
    },
    revalidate: 60 * 12,
  };
};
