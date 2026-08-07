create or replace function public.handle_new_user() 
returns trigger 
language plpgsql
security definer
as $$
declare
    user_role uuid;
begin
    select id
    into user_role
    from public.roles
    where name = 'user';

    insert into public.profiles(id, email, role_id)
    values (new.id, new.email, user_role);

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();