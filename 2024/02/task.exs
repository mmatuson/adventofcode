defmodule AdventOfCode.Y2024.D02 do
  @moduledoc """
  Day 2: Red-Nosed Reports
  """

  def parse_input(filepath) do
    File.read!(filepath   )
      |> String.split("\n", trim: true)
      |> Enum.map(fn line ->
        String.split(line, " ", trim: true)
        |> Enum.map(&String.to_integer/1)
      end)
  end


  def check_report(_value, {:unsafe}) do
    {:unsafe}
  end

  def check_report(value, prev) when is_integer(prev) do
    valid_distance? = abs(prev - value) in Range.new(1,3)
    direction = if prev > value, do: :dec, else: :inc
    if valid_distance?, do: {direction, value}, else: {:unsafe}
  end

  def check_report(value, { direction, prev } ) do
    valid_distance? = abs(prev - value) in Range.new(1,3)
    valid_direction? = if direction === :inc, do: prev < value, else: prev > value
    if valid_direction? && valid_distance?, do: {direction, value}, else: {:unsafe}
  end

  def check_report_with_dampener(r) do
    ri =  Enum.with_index(r, fn element, index -> {index, element} end)

    Range.new(0, Enum.count(r) - 1)
      |> Enum.map(fn i ->
        Enum.reject(ri, fn {index, _el} -> i === index end)
        |> Enum.map(fn {_index, el} -> el end)
        |> Enum.reduce(&check_report/2)
      end)
      |> Enum.any?(fn
        {:unsafe} -> false
        {_d, _v} -> true
      end)
  end


  def unsafe_handler(false, _r), do: 0

  def unsafe_handler(true, r) do
    case check_report_with_dampener(r) do
      false -> 0
      true -> 1
    end
  end

  def solve(dampen?) do
    parse_input("input.txt")
      |> Enum.map(fn r ->
        case Enum.reduce(r, &check_report/2) do
          {:unsafe} -> unsafe_handler(dampen?, r)
          {_d, _v} -> 1
        end
      end)
      |> Enum.sum()
      |> IO.inspect()
 end

end

AdventOfCode.Y2024.D02.solve(false)
AdventOfCode.Y2024.D02.solve(true)
