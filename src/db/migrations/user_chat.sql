select * from "user"

create table user_chat (
                           id serial primary key,
                           user_one INT REFERENCES "user"(id),
                           user_two INT REFERENCES "user"(id)
)

select * from user_chat

create table user_chat_message (
                                   id serial primary key,
                                   chat_id INT REFERENCES "user_chat"(id),
                                   user_id INT REFERENCES "user"(id),
                                   message varchar not null,
                                   created_at timestamp default now()
)

SELECT * FROM user_chat_message
WHERE chat_id = (
    SELECT uc.id FROM user_chat uc
    WHERE (uc.user_one = 1 AND uc.user_two = 3)
       OR (uc.user_one = 3 AND uc.user_two = 1)
    LIMIT 1
    );

insert into user_chat_message (chat_id, user_id, message) values (1,3,'Hello you too')


    insert into user_chat (user_one, user_two) values (1,3)
SELECT uc.id FROM user_chat uc
WHERE (uc.user_one = 1 AND uc.user_two = 3)
   OR (uc.user_one = 3 AND uc.user_two = 1)
    LIMIT 1
