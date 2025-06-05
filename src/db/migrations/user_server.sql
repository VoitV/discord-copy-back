CREATE TABLE user_server (
     server_id INT REFERENCES server(id),
     user_id INT REFERENCES "user"(id),
     PRIMARY KEY (server_id, user_id)
);

insert into user_server (server_id, user_id) values (3,2)

select * from server
left join user_server
on server.id = user_server.server_id
where user_id = 1
