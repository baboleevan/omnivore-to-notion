require('dotenv').config();
const { Client } = require('@notionhq/client');
const { Omnivore } = require('@omnivore-app/api');

// API 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const omnivore = new Omnivore({
  apiKey: process.env.OMNIVORE_API_KEY,
  baseUrl: 'https://api-prod.omnivore.app'
});

async function getAllItems() {
  let allItems = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const response = await omnivore.items.search({
      first: 100,
      after: endCursor,
      includeContent: true
    });

    allItems = allItems.concat(response.edges);
    hasNextPage = response.pageInfo.hasNextPage;
    endCursor = response.pageInfo.endCursor;

    console.log(`${allItems.length}개의 항목을 가져왔습니다...`);
  }

  return allItems;
}

// Omnivore에서 데이터를 가져와서 Notion으로 전송하는 함수
async function transferToNotion() {
  try {
    // 모든 항목 가져오기
    console.log('Omnivore에서 항목들을 가져오는 중...');
    const items = await getAllItems();
    console.log(`총 ${items.length}개의 항목을 가져왔습니다.`);

    // 각 항목을 Notion에 추가
    for (const edge of items) {
      const item = edge.node;

      // 컨텐츠를 2000자로 제한
      const truncatedContent = (item.content || '').slice(0, 1900) +
        (item.content?.length > 1900 ? '... (내용 계속)' : '');

      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID,
          type: 'database_id'
        },
        properties: {
          Title: {
            title: [{
              text: {
                content: item.title || 'Untitled'
              }
            }]
          },
          URL: {
            url: item.url
          },
          SavedAt: {
            date: {
              start: item.savedAt
            }
          },
          Labels: {
            multi_select: item.labels.map(label => ({
              name: label.name
            }))
          }
        },
        children: [{
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: {
                content: truncatedContent
              }
            }]
          }
        }]
      });

      console.log(`${item.title} 전송 완료`);
    }

    console.log('모든 항목 전송 완료!');
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

// 함수 실행
transferToNotion();
