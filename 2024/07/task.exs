defmodule AdventOfCode.Y2024.D07 do
  @moduledoc """
  Day 7: Bridge Repair
  """

  def parse_input(filepath) do
    File.read!(filepath)
      |> String.split("\n", trim: true)
      |> Enum.map(fn line ->
        String.split(line, ~r":|\s", trim: true)
          |> Enum.map(&String.to_integer/1)
      end)
  end

  def calc(operands, <<"+", _rest::binary>> = operators, nil) do
    calc(operands, operators, 0)
  end

  def calc(operands, <<"*", _rest::binary>> = operators, nil) do
    calc(operands, operators, 1)
  end

  def calc([op | operands], <<"+", rest::binary>>, acc) do
    calc(operands, rest, op + acc)
  end

  def calc([op | operands], <<"*", rest::binary>>, acc) do
    calc(operands, rest, op * acc)
  end

  def calc([], _, acc) do
    acc
  end

  def possible_answers(equation) do
    [test | operands] = equation

    case Enum.count(operands) do
      1 -> { test, operands, operands}
      _ ->
        answers = operands
        |> Enum.count()
        |> perms()
        |> Enum.map(fn operators -> calc(operands, operators, nil) end)
        {test, answers, operands}
      end
  end

  defp partitions(list) do
    Enum.map(1..(length(list) - 1), fn i ->
      Enum.split(list, i)
    end)
  end

  def perms(size) do
    Enum.reduce(1..size, [""], fn _, acc ->
      for prefix <- acc, char <- ["+", "*"] do
        prefix <> char
      end
    end)
  end

  def combine([left, right]) do
    for l <- left, r <- right, do: String.to_integer("#{l}#{r}")
  end

  def solve_part1() do
    parse_input("input.txt")
      |> Enum.map(&possible_answers/1)
      |> Enum.map(fn {test, answers, _} -> if test in answers, do: test, else: 0 end)
      |> Enum.sum()
      |> IO.inspect()
  end

  def solve_part2() do
    parse_input("input.txt")
      |> Enum.map(&possible_answers/1)
      |> Enum.map(fn {test, answers, operands} ->
        case test in answers do
          true -> test
          false ->
            found = Enum.any?(partitions(operands), fn {left, right} ->
              [concat_i | remaining_right] = right
              {_, l, _} = possible_answers([test | left])
              new_left = Enum.map(l, fn x -> String.to_integer("#{x}#{concat_i}") end)
              Enum.any?(new_left, fn nl ->
                {_, answers, _} = possible_answers([test | [nl | remaining_right]])
                test in answers
              end)
            end)
            if found, do: test, else: 0
          end
      end)
      |> List.flatten()
      |> Enum.sum()
      |> IO.inspect()
  end
end

AdventOfCode.Y2024.D07.solve_part1()
AdventOfCode.Y2024.D07.solve_part2()
