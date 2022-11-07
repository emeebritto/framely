export interface SearchContextData {
	inputData:string;
	inputDebounce:string;
	setInputData:(s:string)=> void;
	isTyping:boolean;
	setIsTyping:(s:boolean)=> void;
	typeAhead:TypeAheadList;
	setTypeAhead:(s:TypeAheadList)=> void;
	queriesSuggestions:string[];
	setQueriesSuggestions:(s:string[])=> void;
}