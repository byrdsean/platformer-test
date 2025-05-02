class CollisionInstance {
    private static collidableObjects: CollisionInterface[] = []

    private constructor() {}

    static getCollidableObjects(): CollisionInterface[] {
        return this.collidableObjects;
    }

    static addCollidableObject(collidableObject: CollisionInterface): CollisionInstance[] {
        this.collidableObjects = [...this.collidableObjects, collidableObject];
        return this.collidableObjects;
    }

    static areObjectsColliding(collidableObject1: CollisionInterface, collidableObject2: CollisionInterface): boolean {
        const collisionDim1 = collidableObject1.getCollisionDimensions();
        const collisionDim2 = collidableObject2.getCollisionDimensions();

        if (collisionDim1.maxX < collisionDim2.minX) {
            return false;
          }
    
          if (collisionDim2.maxX < collisionDim1.minX) {
            return false;
          }
    
          if (collisionDim1.maxY < collisionDim2.minY) {
            return false;
          }
    
          if (collisionDim2.maxY < collisionDim1.minY) {
            return false;
          }
    
          return true
    }
}