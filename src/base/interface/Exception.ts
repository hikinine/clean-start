import {Response } from "express"

export interface Catch<T> {
  response: Response;
  error: T;
}

export interface ResponseListAll {
  total: number
  payload: unknown
}