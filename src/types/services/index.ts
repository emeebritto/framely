
export interface User {
	location:string;
	explicitly_followed_by_me:boolean;
	type:string;
	indexed:boolean;
	username:string;
	blocked_by_me:boolean;
	image_small_url:string;
	followed_by_me:boolean;
	full_name:string;
	is_default_image:boolean;
	id:string;
	first_name:string;
	image_medium_url:string;
	follower_count:number;
	domain_verified:boolean;
	locale:string;
	is_verified_merchant:boolean;
}

export interface ImageInfor {
	width:number;
	height:number;
	url:string;
}

export interface VideoInfor {
	width:number;
	height:number;
	duration:number;
	url:string;
	thumbnail:string;
	captions_urls:any;
	best_captions_url:string;
}

export interface DataBlock {
	block_type:number;
	type:string;
	video_signature:string;
	block_style:any;
	video: {
		video_list: {
			V_HLSV3_MOBILE:VideoInfor;
			V_EXP7:VideoInfor;
			V_EXP6:VideoInfor;
			V_EXP5:VideoInfor;
			V_EXP4:VideoInfor;
			V_EXP3:VideoInfor;
		};
		id:string;
		bitrates:null|any;
	};
}

export interface StoryPage {
	layout:number;
	blocks:DataBlock[];
	video:null|any;
	id:string;
	image_signature_adjusted:string;
	should_mute:boolean;
	image_signature:string;
	type:string;
	video_signature:null|string;
	image: {
		dominant_colors:string;
		images: {
			originals: {
				url:string;
				width:number;
				height:number;
			};
			"750x": {
				url:string;
				width:number;
				height:number;
			};
			"236x": {
				url:string;
				width:number;
				height:number;
			};
		};
	};
	image_adjusted: {
		dominant_color:string;
		images: {
			originals: {
				url:string;
				width:number;
				height:number;
			};
			"750x": {
				url:string;
				width:number;
				height:number;
			};
			"236x": {
				url:string;
				width:number;
				height:number;
			};
		};
	};
}

export interface StoryData {
	has_product_pins:boolean;
	id:string;
	page_count:number;
	type:string;
	pages:StoryPage[];
	is_deleted:boolean;
	metadata: {
		root_pin_id:string;
		pin_image_signature:string;
		pin_title:string;
		compatible_version:string;
		canvas_aspect_ratio:number;
		is_editable:boolean;
		is_compatible:boolean;
		is_promotable:boolean;
		root_user_id:string;
	};
}


export interface Frame {
	closeup_description:string;
	is_playable:boolean;
	share_count:number;
	seo_description:string;
	repin_count:number;
	description_html:string;
	image_signature:string;
	image_medium_url:string;
	is_stale_product:boolean;
	should_redirect_id_only_url_to_text_url:boolean;
	pinner:User;
	is_quick_promotable:boolean;
	privacy:string;
	seo_title:string;
	seo_url:string;
	can_delete_did_it_and_comments:boolean;
	dominant_color:string;
	tracking_params:string;
	id:string;
	closeup_user_note:string;
	is_native:boolean;
	closeup_unified_description:string;
	is_repin:boolean;
	did_it_disabled:boolean;
	is_promotable:boolean;
	is_oos_product:boolean;
	board:string;
	type:string;
	tracked_link:string;
	is_video:boolean;
	created_at:string;
	comment_count:number;
	is_hidden:boolean;
	comments_disabled:boolean;
	description:string;
	link:string;
	domain:string;
	last_repin_date:string;
	title:string;
	grid_title:string;
	story_pin_data:null|StoryData;
	story_pin_data_id:string;
	relatedFrames?:undefined|RelatedFrames;
	images: {
		orig:ImageInfor;
		"736x":ImageInfor;
		"474x":ImageInfor;
	};
}

export interface RelatedFrames {
	result:Frame[];
	bookmark:string;
};

export type Frameslist = Frame[];

export interface SearchResponse {
	query:string;
	results:Frame[];
	bookmark:string;
}

export interface TypeAhead {
	query:string;
	type:string;
	url:string;
	label:string;
	resultIndex:number;
}

export type TypeAheadList = TypeAhead[];