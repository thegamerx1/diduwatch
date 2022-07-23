type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';
type Status = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
type Relation =
	| 'ADAPTATION'
	| 'PREQUEL'
	| 'SEQUEL'
	| 'PARENT'
	| 'SIDE_STORY'
	| 'CHARACTER'
	| 'SUMMARY'
	| 'ALTERNATIVE'
	| 'SPIN_OFF'
	| 'OTHER'
	| 'SOURCE'
	| 'COMPILATION'
	| 'CONTAINS';

interface Anime {
	id: number;
	title: string;
	cover: string;
	banner: string;
	episodes: number;
	averageScore: number;
	status: Status;
	start: Date;
}

interface AnimeR extends Anime {
	relations: (Anime & { relationType: Relation })[];
}

interface AnimeEntry {
	isFav: boolean;
	id: number;
	status: MediaListStatus;
	completed: Date;
}
