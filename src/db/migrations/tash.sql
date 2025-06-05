create table server (
                        id serial primary key,
                        title varchar(40),
                        icon varchar(40) default null
)

drop table "server"

    insert into server (title) values ('Мій сервер')

select * from server


CREATE TABLE user_server (
                             server_id INT REFERENCES server(id),
                             user_id INT REFERENCES "user"(id),
                             PRIMARY KEY (server_id, user_id)
);

select * from user_server


drop table user_server

alter table "server" add column host_id int references "user" (id)

    insert into user_server (server_id, user_id) values (4,1)

DELETE FROM user_server
WHERE server_id = 4 AND user_id = 1


select * from user_server

select * from server
                  left join user_server
                            on server.id = user_server.server_id
where user_id = 1
