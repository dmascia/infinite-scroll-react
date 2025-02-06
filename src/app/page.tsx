"use client"

import styles from "./index.module.css";
import { useCallback, useState} from "react";
import {faker} from "@faker-js/faker/locale/en";

type User = {
    id: string;
    username: string;
    email: string;
    location: string;
    avatar: string;
    registeredAt: string;
}

const ROW_SIZE = 20;

export default function Home() {
    const [users] = useState<User[]>(() => {
       return Array<User[]>(1000).fill([]).map((_: User[]): User => {
           return {
               id: faker.string.uuid(),
               username: faker.internet.username(),
               email: faker.internet.email(),
               avatar: faker.image.avatar(),
               location: faker.location.state(),
               registeredAt: String(faker.date.past()),
           };
       });
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users.slice(0, currentPage * ROW_SIZE));

    const debounce = (func: (...args: unknown[]) => void, wait: number) => {
        let timeoutId: string | number | NodeJS.Timeout | undefined;
        return (...args: unknown[]) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                func(...args)
            }, wait);
        }
    }

    const onScroll = useCallback(() => {
        setCurrentPage((currentPage) => currentPage + 1);
        setFilteredUsers(users.slice(0, currentPage * ROW_SIZE));
    }, [currentPage, users]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Infinite <span className={styles.pinkSpan}>Scroll</span> App
        </h1>
          <div className={styles.scrollContainer} onScroll={debounce(onScroll, 500)}>
              <table>
                  <tbody>
                      {filteredUsers.map((user: User) => {
                          return (<tr key={user.id}>
                              <td>{user.username}</td>
                              <td>{user.email}</td>
                              <td>{user.location}</td>
                              <td>{user.registeredAt}</td>
                          </tr>)
                      })}
                  </tbody>
              </table>
          </div>

         <span className={styles.pinkSpan}>  Displaying: {currentPage * ROW_SIZE} / {users.length} </span>
      </div>
    </main>
  );
}
