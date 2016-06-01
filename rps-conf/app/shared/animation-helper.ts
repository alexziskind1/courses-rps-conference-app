import { View } from 'ui/core/view';
import { AnimationDefinition } from 'ui/animation';
import { AnimationCurve } from 'ui/enums';

let duration: number = 250;
let scaleFactor: number = 1.8;

export function popAnimate(view: View) {
    
    var defPopUp: AnimationDefinition = {
        duration: duration,
        curve: AnimationCurve.easeIn,
        scale: { x: scaleFactor, y: scaleFactor }
    };
    
    var defPopDown: AnimationDefinition = {
        duration: duration,
        curve: AnimationCurve.easeOut,
        scale: { x: 1.0, y: 1.0 }
    };

    return view.animate(defPopUp)
           .then(()=>{
               view.animate(defPopDown);
            });
}

export function fadeIn(view: View) {
    return view.animate({
        opacity: 1.0,
        duration: duration
    });
}