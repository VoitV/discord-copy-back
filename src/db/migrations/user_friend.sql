create table user_friend (
     user_one integer REFERENCES "user" (id),
     user_two integer REFERENCES "user" (id)
)

 insert into user_friend (user_one, user_two) values (2,5)

SELECT * FROM "user"
WHERE "user".id IN (
    SELECT user_two FROM "user_friend"
    WHERE user_one = 1
);
