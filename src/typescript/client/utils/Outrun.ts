
/**
 * world, camera, screen - these are the basic models of where items are in the world
 * where they should appear in the camera viewport and where they should be on the screen
 * mainly handled by the the project method.
 * 
 *
 * @interface WCS
 */
interface WCS {
   world: Phaser.Math.Vector3;
   camera: Phaser.Math.Vector3;
   screen: Phaser.Math.Vector4;
   scale: number;
}



export default function OutrunProject(p: WCS, cameraX: number, cameraY: number, cameraZ: number, cameraDepth: number, width: number, height: number, roadWidth: number): void {
   p.camera.x = (p.world.x || 0) - cameraX;
   p.camera.y = (p.world.y || 0) - cameraY;
   p.camera.z = (p.world.z || 0) - cameraZ;
   p.scale = cameraDepth / p.camera.z;
   p.screen.x = Math.round((width / 2) + (p.scale * p.camera.x * width / 2));
   p.screen.y = Math.round((height / 4.6) - (p.scale * p.camera.y * height / 2));
   p.screen.w = Math.round((p.scale * roadWidth * width / 2.5));
}