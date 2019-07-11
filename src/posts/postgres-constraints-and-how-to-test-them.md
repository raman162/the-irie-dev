---
title: Postgres Constraints And How To Test Them
date: 2019-07-09
description: Quick how to article on why and when you should use constraints in
             postgresql and how to to test them using pgTAP
tags: ['test', 'testing', 'constraint', 'pgtap', 'postgres', 'unique', 'index',
'postgresql']
published: true
---

Modern day applications need to persist their state with a database. If you
haven't jumped on the [nosql database](https://en.wikipedia.org/wiki/NoSQL)
train, you probably utilize a [relational
database](https://en.wikipedia.org/wiki/Relational_database) such as
[Postgresql](https://www.postgresql.org/). Today we will be taking a look at
the importance of [database
constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) and
how to test them using [pgTAP](https://pgtap.org/).


## Why you should use constraints
Your database is the source of truth for all data at any point in time and with
constraints you can set up guardrails to protect that data. Constraints assist
with ensuring the state of your data never invalidates your business logic.
Imagine you're developing booking software for a hotel and a requirement is to
not allow a room to be double booked on the same day. You can use constraints
to ensure such conflicts will not arise.

## Why you should test your constraints
Now that you understand why we need constraints, why should we test them?
Because that's what developers do! We write unit tests if we want confidence in
our code, therefore we should write tests if we want confidence in our schema.
As our constraints become more complex, it becomes even more important to write
tests for the behavior. This can be done with `<insert-favourite-language>`,
however that process is more involved and is likely to be slower than pgTAP.

## How to test your constraints

In this example we will be writing a constraint to prevent the double booking
example discussed above.  We will also be using
[Docker](https://docs.docker.com/install/) and
[Docker-Compose](https://docs.docker.com/compose/install/) so you don't have to
worry about installing some new software (unless you don't have docker yet of
course).

*If you don't want to follow along, you can pull this
[Github repo](https://github.com/raman162/pgtap-test-constraints) and just
follow the steps in the README.*

### Initialize Docker-Compose Project

Create new project directory
```bash
mkdir test_pgtap_constraints
cd test_pgtap_constraints
touch docker-compose.yml
```

Create `docker-compose.yml`
```yaml
version: '3'
services:
  db:
    image: postgres:11.4-alpine
    environment:
      - POSTGRES_USER=test_pg_tap
      - POSTGRES_PASSWORD=supersecret
      - PGPASSWORD=supersecret
    volumes:
      - ./pg-data:/var/lib/postgresql/data
      - ./seeds:/seeds
  pgtap:
    image: hbpmip/pgtap:1.0.0-2
    environment:
      - DATABASE=awesome_hotel_booking
      - USER=test_pg_tap
      - PASSWORD=supersecret
    depends_on:
      - db
    volumes:
      - ./pgtap:/test
```
Here we are using two images:
* [Postgres 11](https://hub.docker.com/_/postgres)
* [pgTAP 1.0.0-2](https://hub.docker.com/r/hbpmip/pgtap)

Start the postgres database server
```
# test_pgtap_constraints/
docker-compose up -d db
```


### Initialize Database

Enter the `psql` console
```bash
# test_pgtap_constraints/
docker-compose run db psql -h db -U test_pg_tap
```

```sql
CREATE DATABASE awesome_hotel_booking;
\c awesome_hotel_booking
CREATE TABLE bookings (
  id bigint NOT NULL,
  room_number bigint NOT NULL,
  date date NOT NULL,
  name  character varying NOT NULL
);
```

### Write pgTAP Tests

Within the `test_pgtap_constraints` directory, create and enter a `pgtap`
directory.
```bash
# test_pgtap_constraints/
mkdir pgtap
cd pgtap
```

Create `bookings.sql`.
```sql
BEGIN;

SELECT plan(8);
SELECT has_table('bookings');
SELECT col_not_null('bookings', 'id');
SELECT col_not_null('bookings', 'room_number');
SELECT col_not_null('bookings', 'date');
SELECT col_not_null('bookings', 'name');

PREPARE insert_310_july_4_booking AS INSERT INTO bookings (
  id, room_number, date, name
) VALUES (1, 310, '2019-07-04', 'Kevin Hart');
SELECT lives_ok(
  'insert_310_july_4_booking',
  'can insert booking with all attributes'
);

PREPARE insert_conflict_booking AS INSERT INTO bookings (
  id, room_number, date, name
) VALUES (2, 310, '2019-07-04', 'Dave Chappelle');
SELECT throws_ilike(
  'insert_conflict_booking',
  'duplicate key value violates unique constraint%',
  'do not allow two bookings for the same room on the same date'
);

PREPARE insert_814_july_4_booking AS INSERT INTO bookings (
  id, room_number, date, name
) VALUES (3, 814, '2019-07-04', 'Tina Fey');
SELECT lives_ok(
  'insert_814_july_4_booking',
  'can insert booking in another room on the same date'
);

SELECT * FROM finish();

ROLLBACK;
```
Let's review what we just wrote.

The whole test plan is wrapped in a transaction so all of the inserts are
rollbacked after the test plan finishes.

[`SELECT plan(8)`](https://pgtap.org/documentation.html#usingpgtap) tells pgTAP
that we're going to run 8 tests. It's how all pgTAP test files begin.

[`SELECT
has_table('bookings')`](https://pgtap.org/documentation.html#has_table) ensures
that our schema has a `bookings` table.

[`SELECT col_not_null('bookings',
'id')`](https://pgtap.org/documentation.html#col_not_null) ensures that our
`bookings` table has an `id` column that does not allow `NULL` values.

[`SELECT
lives_ok('insert_310_july_4_booking')`](https://pgtap.org/documentation.html#lives_ok)
ensures that the [prepared statement]()  we wrote executes without raising any
error.

[`SELECT
throws_ilike('insert_conflict_booking')`](https://pgtap.org/documentation.html#throws_like)
ensures that an error is thrown, when we execute our prepared statement. In
this case we want postgres to throw a duplicate data error because of the
conflict booking. This test case should fail since we have not created our
constraint yet.


[`SELECT * FROM finish()`](https://pgtap.org/documentation.html#usingpgtap)
tells pgTAP that our tests have completed. This is so it can output more
information about failures or alert of you discrepancies between the planned
number of tests and the number actually run.

Lets run our test `bookings.sql` through pgTAP and see the results. Since we
have not created our constraint yet, we are expecting the `throws_like` test to
fail.
```bash
# test_pgtap_constraints/
docker-compose run pgtap

## OUTPUT
Running tests: /test/*.sql
/test/bookings.sql .. 1/8
# Failed test 7: "do not allow two bookings for the same room on the same date"
#     no exception thrown
# Looks like you failed 1 test of 8
/test/bookings.sql .. Failed 1/8 subtests

Test Summary Report
-------------------
/test/bookings.sql (Wstat: 0 Tests: 8 Failed: 1)
  Failed test:  7
  Files=1, Tests=8,  0 wallclock secs ( 0.02 usr +  0.00 sys =  0.02 CPU)
  Result: FAIL
```


### Create Unique Constraint

Enter `psql` console
```bash
# test_pgtap_constraints/
docker-compose run db psql -h db -U test_pg_tap -d awesome_hotel_booking
```

Add unique index
```sql
CREATE UNIQUE INDEX bookings_room_date_uq ON public.bookings (date, room_number);
```

Our constraint is actually a [unique index]() that ensures that a there cannot
be two booking records with the same date and room number. If this happens,
postgres will throw the unique validation error


### Rerun pgTAP Tests
```bash
# test_pgtap_constraints/
docker-compose run pg_tap

## OUTPUT
Running tests: /test/*.sql
/test/bookings.sql .. ok
All tests successful.
Files=1, Tests=8,  0 wallclock secs ( 0.02 usr +  0.00 sys =  0.02 CPU)
Result: PASS
```

Our tests are passing. Yay!

### Project Cleanup

Stop postgres database server
```bash
# test_pgtap_constraints/
docker-compose down
```

## Conclusion
Constraints are a useful way to ensure the integrity of our data. Once
implemented, we can test and validate the behaviour of those
constraints with pgTAP.

## Further Reading
* [pgTAP Docs](https://pgtap.org/documentation.html)
* [Unit Testing functions in PostgreSQL](https://medium.com/engineering-on-the-incline/unit-testing-functions-in-postgresql-with-pgtap-in-5-simple-steps-beef933d02d3)

