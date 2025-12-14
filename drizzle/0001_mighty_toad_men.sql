CREATE TABLE `articulationMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ccCourseId` int NOT NULL,
	`usvCourseId` int NOT NULL,
	`equivalencyType` enum('direct','elective','partial','none') NOT NULL,
	`similarityScore` int,
	`notes` text,
	`status` enum('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articulationMappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `cc_usv_idx` UNIQUE(`ccCourseId`,`usvCourseId`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionId` int NOT NULL,
	`courseCode` varchar(50) NOT NULL,
	`title` varchar(500) NOT NULL,
	`units` int NOT NULL,
	`description` text,
	`prerequisites` text,
	`learningOutcomes` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `institution_course_idx` UNIQUE(`institutionId`,`courseCode`)
);
--> statement-breakpoint
CREATE TABLE `degreePrograms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`degreeType` varchar(100) NOT NULL,
	`department` varchar(255),
	`totalUnitsRequired` int NOT NULL,
	`description` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `degreePrograms_id` PRIMARY KEY(`id`),
	CONSTRAINT `degreePrograms_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `degreeRequirements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`degreeProgramId` int NOT NULL,
	`courseId` int NOT NULL,
	`requirementType` enum('core','major','elective','general_education') NOT NULL,
	`geAreaId` int,
	`required` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `degreeRequirements_id` PRIMARY KEY(`id`),
	CONSTRAINT `degree_course_idx` UNIQUE(`degreeProgramId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `geAreas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`label` varchar(255) NOT NULL,
	`description` text,
	`transferable` boolean NOT NULL DEFAULT true,
	`color` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `geAreas_id` PRIMARY KEY(`id`),
	CONSTRAINT `geAreas_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `geMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`geAreaId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `geMappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_ge_idx` UNIQUE(`courseId`,`geAreaId`)
);
--> statement-breakpoint
CREATE TABLE `importHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`importType` enum('csv_courses','csv_mappings','pdf_catalog') NOT NULL,
	`fileName` varchar(500),
	`recordsProcessed` int DEFAULT 0,
	`recordsSuccess` int DEFAULT 0,
	`recordsError` int DEFAULT 0,
	`errorLog` text,
	`importedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `importHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`shortName` varchar(100),
	`type` enum('university','community_college') NOT NULL,
	`website` varchar(500),
	`catalogUrl` varchar(500),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `institutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `status_idx` ON `articulationMappings` (`status`);--> statement-breakpoint
CREATE INDEX `cc_course_idx` ON `articulationMappings` (`ccCourseId`);--> statement-breakpoint
CREATE INDEX `usv_course_idx` ON `articulationMappings` (`usvCourseId`);--> statement-breakpoint
CREATE INDEX `course_code_idx` ON `courses` (`courseCode`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `degreePrograms` (`code`);--> statement-breakpoint
CREATE INDEX `degree_idx` ON `degreeRequirements` (`degreeProgramId`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `institutions` (`name`);