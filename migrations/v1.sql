CREATE TABLE VerifyArticles (
	id SERIAL PRIMARY KEY,
	articleTitle varchar(100) NOT NULL,
	articleType varchar(50) NOT NULL,
	articleContent varchar NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAT TIMESTAMP NOT NULL DEFAULT NOW(),
)

CREATE TABLE VerifyArticles (
	id SERIAL PRIMARY KEY,
	articleTitle varchar(100) NOT NULL,
	articleType varchar(50) NOT NULL,
	articleContent varchar NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAT TIMESTAMP NOT NULL DEFAULT NOW(),
)