create table server (
    id serial primary key,
    title varchar(40),
    icon varchar(40),
    type varchar(10) default 'server',
    is_public boolean default false,
    host_id int references "user" (id)
)
