defmodule AdventOfCode.Y2024.D04 do
  @moduledoc """
  Day 4: Ceres Search
  """

  def parse_input(filepath) do
    File.read!(filepath)
    |> String.split("\n", trim: true)
  end

  @doc """
  Convert the 2D array into a Map of {x,y}: <character> for easy iteration
  """
  def to_grid_map(data) do
    data
    |> Enum.with_index()
    |> Enum.reduce(%{}, fn { row, ri}, acc ->
      String.split(row, "", trim: true)
       |> Enum.with_index()
       |> Enum.into(acc, fn {col, ci } -> {{ri, ci}, col} end)
    end)
  end

  ##
  ## Part 1 code
  ##

  def check(grid, {x,y}, {dx, dy}, <<c::binary-size(1), rest::binary>>) do
    curr = grid[{x,y}]

    cond do
      curr === nil -> []
      curr !== c -> []
      curr === c && byte_size(rest) === 0 -> {x,y}
      curr === c -> check(grid, {dx + x, dy + y}, {dx, dy}, rest)
    end
  end


  def begin_check(grid, start, str) do
    [{0,-1}, {0, 1}, {-1, 0}, {1, 0}, {-1, -1}, {1, 1}, {1,-1}, {-1, 1}]
      |> Enum.map(fn direction ->
        case check(grid, start, direction, str) do
          {x,y} -> [{start, {x,y}}]
          [] -> []
        end
      end)

  end

  def solve_part1() do
    grid = parse_input("input.txt") |> to_grid_map()

    grid
      |> Map.keys()
      |> Enum.map(fn start -> begin_check(grid, start, "XMAS") end)
      |> List.flatten()
      |> Enum.reject(fn x -> x === [] end)
      |> Enum.into(MapSet.new())
      |> MapSet.size()
      |> IO.inspect()

  end


  ##
  ## Part 2 code
  ##

  def create_mas(grid, d, {x,y}) do
    d
    |> Enum.map(fn {dx,dy} -> {dx + x, dy + y} end)
    |> Enum.map(fn d -> grid[d] end)
    |> Enum.join("A")
  end

  def check_x(grid, {x,y}) do
    [
      create_mas(grid, [{-1, -1}, {1, 1}], {x,y}),
      create_mas(grid, [{-1, 1}, {1, -1}], {x,y})
    ]
    |> Enum.all?(fn s -> s === "MAS" || s === "SAM" end)
    |> (fn bool -> if bool, do: 1, else: 0 end).()

  end

  def solve_part2() do
    grid = parse_input("input.txt") |> to_grid_map()

    grid
    |> Map.keys()
    |> Enum.filter(fn {x,y} -> grid[{x,y}] === "A" end)
    |> Enum.map(fn a -> check_x(grid, a) end)
    |> Enum.sum()
    |> IO.inspect()
  end
end

AdventOfCode.Y2024.D04.solve_part1()
AdventOfCode.Y2024.D04.solve_part2()
