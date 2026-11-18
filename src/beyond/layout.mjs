// The photograph is fitted first. Its mat and caption are added outside its edges.
export function fitPhotoBox(width,height,aspect,horizontalInsets,verticalInsets){
 if(![width,height,aspect,horizontalInsets,verticalInsets].every(Number.isFinite)||aspect<=0||width<=horizontalInsets||height<=verticalInsets)return null;
 const photoHeight=Math.min(height-verticalInsets,(width-horizontalInsets)/aspect),photoWidth=photoHeight*aspect;
 return {width:photoWidth+horizontalInsets,height:photoHeight+verticalInsets,photoWidth,photoHeight};
}
