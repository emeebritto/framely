import { Frame, Frameslist, TypeAhead } from "types/services";


export interface FrameStoryProps {
	frame:Frame;
}

export interface FullViewProp {
	src?:any | null;
	onRequestClose?:((s?:any)=> void);
}

export interface GridProps {
	source:Frameslist[];
	onSelect:((f:any)=> void);
}

export interface GridFrameProps {
	type:string;
	src:Frame;
	onSelect:((f:Frame)=> void);
}

export interface OptionsTypeAheadProps {
	show?:boolean;
	resource:Array<TypeAhead>;
	onSelect:((s:string)=> void);
}

export interface VideoPlayerProps {
	url:string;
	playing:boolean;
}

export interface SlideVideoPlayerProps {
	url:string;
}

export interface Frame_p9Props {
	src:Frame;
	onSelect?:((s:Frame)=> void);
}

export interface Frame_u8Props {
	src:any;
	onSelect?:((s:any)=> void);
}

export interface FrameDurationProps {
	frame:Frame;
}
