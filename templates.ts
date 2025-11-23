import { BoardItem, ItemType } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  items: Omit<BoardItem, 'id' | 'position'>[];
}

// Helper to create a basic structure for items without ID/Position
const createItem = (
  type: ItemType,
  content: string,
  props: Partial<Omit<BoardItem, 'id' | 'position' | 'type' | 'content'>>
): Omit<BoardItem, 'id' | 'position'> => ({
  type,
  content,
  ...props,
});

export const templates: Template[] = [
  {
    id: 'kanban-basic',
    name: 'Basic Kanban Board',
    description: 'A simple To Do, In Progress, and Done setup.',
    items: [
      createItem(ItemType.KANBAN, 'To Do', { width: 300, height: 500 }),
      createItem(ItemType.KANBAN, 'In Progress', { width: 300, height: 500 }),
      createItem(ItemType.KANBAN, 'Done', { width: 300, height: 500 }),
    ],
  },
  {
    id: 'brainstorm-web',
    name: 'Web Project Brainstorm',
    description: 'A starting point for brainstorming a new web project.',
    items: [
      createItem(ItemType.NOTE, '# Project Goals', { 
        width: 300, 
        height: 200, 
        color: '#DBEAFE', 
        style: { fontSize: 'lg', fontWeight: 'bold', textAlign: 'center' } 
      }),
      createItem(ItemType.CONTAINER, 'User Personas', { width: 400, height: 400, color: '#F3E8FF' }),
      createItem(ItemType.TODO, 'Key Features', { width: 280, height: 300 }),
      createItem(ItemType.NOTE, '## Tech Stack\n- Frontend: \n- Backend: \n- Database: ', { width: 240, height: 200, color: '#D1FAE5' }),
    ],
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats.',
    items: [
        createItem(ItemType.NOTE, '## Strengths\n- ', { width: 250, height: 250, color: '#D1FAE5' }),
        createItem(ItemType.NOTE, '## Weaknesses\n- ', { width: 250, height: 250, color: '#FEE2E2' }),
        createItem(ItemType.NOTE, '## Opportunities\n- ', { width: 250, height: 250, color: '#DBEAFE' }),
        createItem(ItemType.NOTE, '## Threats\n- ', { width: 250, height: 250, color: '#FEF3C7' }),
    ]
  }
];
