import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';

import ptBR from 'date-fns/locale/pt-BR';
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
  return (
    <div>
      <img src={post.data.banner.url} alt="banner" />
      <div>
        <strong>{post.data.title}</strong>
        <time>{post.first_publication_date}</time>
        <span>{post.data.author}</span> 4 mim <time />
      </div>
      {post.data.content.map(content => (
        <div key={content.heading}>
          <strong>{content.heading}</strong>
          <div
            dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
          />
        </div>
      ))}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query();
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(JSON.stringify(response.data.content, null, 2));

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: response.data,
  };

  return {
    props: {
      post,
    },
  };
};
