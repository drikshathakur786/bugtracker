import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BugCard from "./BugCard";
import styles from './KanbanBoard.module.css';

// Column display config
const COLUMNS = [
  { id: 'OPEN',        label: 'Open',        color: '#e53e3e' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#d69e2e' },
  { id: 'IN_REVIEW',   label: 'In Review',   color: '#3182ce' },
  { id: 'CLOSED',      label: 'Closed',      color: '#38a169' },
];

function KanbanBoard({ bugsByStatus, onDragEnd }) {
  return (
    // DragDropContext wraps the entire drag and drop area
    // onDragEnd fires when user drops a card — we handle status update there
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {COLUMNS.map(column => (
          <div key={column.id} className={styles.column}>
            {/* Column Header */}
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

            {/* Droppable area — where cards can be dropped */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.cardList} ${
                    snapshot.isDraggingOver ? styles.draggingOver : ''
                  }`}
                >
                  {/* Render each bug as a Draggable card */}
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
                  {/* Placeholder keeps column height while dragging */}
                  {provided.placeholder}

                  {/* Empty state for column */}
                  {bugsByStatus[column.id]?.length === 0 && (
                    <div className={styles.empty}>No bugs here</div>
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