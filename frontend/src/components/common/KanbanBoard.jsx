import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BugCard from "./BugCard";
import styles from './KanbanBoard.module.css';

const COLUMNS = [
  { id: 'OPEN',        label: 'Open',        color: 'var(--purple)' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'var(--accent)' },
  { id: 'IN_REVIEW',   label: 'In Review',   color: 'var(--yellow)' },
  { id: 'CLOSED',      label: 'Closed',      color: 'var(--green)' },
];

function KanbanBoard({ bugsByStatus, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {COLUMNS.map(column => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div
                className={styles.colorDot}
                style={{ background: column.color }}
              />
              <span className={styles.columnTitle}>{column.label}</span>
              <span className={styles.count}>
                {bugsByStatus[column.id]?.length || 0}
              </span>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.cardList} ${
                    snapshot.isDraggingOver ? styles.draggingOver : ''
                  }`}
                >
                  {bugsByStatus[column.id]?.map((bug, index) => (
                    <Draggable
                      key={bug.id}
                      draggableId={bug.id}
                      index={index}
                    >
                      {(provided) => (
                        <BugCard
                          bug={bug}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {bugsByStatus[column.id]?.length === 0 && (
                    <div className={styles.empty}>No issues</div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;