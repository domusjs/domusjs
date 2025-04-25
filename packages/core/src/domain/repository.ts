/**
 * Interface representing a repository for managing entities in the domain model.
 *
 * This interface provides methods for finding and saving entities, ensuring that
 * all repositories have a consistent structure and behavior.
 *
 * @template T - The type of the entity managed by the repository.
 *
 * @remarks
 * Repositories are responsible for encapsulating the logic required to access data sources
 * and perform operations on entities. This interface defines the basic operations that
 * all repositories must implement.
 *
 */

export interface Repository<T> {
  /**
   * Finds an entity by its unique identifier.
   * @param id - The unique identifier of the entity
   * @returns The entity if found, or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Saves an entity to the persistence layer.
   * @param entity - The entity to save
   */
  save(entity: T): Promise<void>;
}
