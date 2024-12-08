defmodule AdventOfCode.Y2024.D06 do
  @moduledoc """
  Day 6: Guard Gallivant
  """

  def parse_input(filepath) do
    File.read!(filepath)
    |> String.split("\n", trim: true)
  end

  @doc """
  Convert the 2D array into a Map of {x,y}: <character> for easy iteration
  """
  def to_grid_map(data) do
    grid = data
    |> Enum.with_index()
    |> Enum.reduce(%{}, fn { row, ri}, acc ->
      String.graphemes(row)
       |> Enum.with_index()
       |> Enum.into(acc, fn {col, ci } -> {{ri, ci}, col} end)
    end)

    row_len = Enum.count(data)
    col_len = Enum.at(data, 0) |> byte_size()

    {grid, row_len, col_len}
  end

  def blocked?(grid, pos) do
    grid[pos] === "#"
  end

  def oob?({x,y},  row_len, col_len) do
    (x <  0 || x > row_len - 1)  || (y < 0 || y > col_len - 1)
  end

  def visited?(visited, visit) do
    MapSet.member?(visited, visit)
  end

  def find_marker(grid, marker) do
    grid
      |> Map.keys()
      |> Enum.filter(fn {x,y} -> grid[{x,y}] === marker end)
      |> Enum.at(0)
  end


  def move(visited, {x,y}, {dx,dy}, grid, row_len, col_len, ignore_loops \\ false) do
    visit =  if ignore_loops, do: {x,y}, else: {x,y,dx,dy}
    next = {x + dx, y + dy}

    cond do
      visited?(visited, visit) && !ignore_loops -> {1, grid}
      oob?(next, row_len, col_len) -> {:oob, MapSet.put(visited, visit), grid}
      blocked?(grid, next) -> move(MapSet.put(visited, visit), {x,y}, {dy, -dx}, grid, row_len, col_len, ignore_loops)
      true -> move(MapSet.put(visited, visit), next, {dx,dy}, grid, row_len, col_len, ignore_loops)
    end
  end

  def solve_part1() do
    data = parse_input("input.txt")
    {grid, row_len, col_len } = to_grid_map(data)

    guard_pos = find_marker(grid, "^")
    {:oob, visited, _} = move(MapSet.new(), guard_pos, {-1, 0}, grid, row_len, col_len, true)

    MapSet.size(visited)
      |> IO.inspect()
  end

  def solve_part2() do
    data = parse_input("input.txt")
    {grid, row_len, col_len } = to_grid_map(data)

    guard_pos = find_marker(grid, "^")

    for x <- 0..(row_len - 1), y <- 0..(col_len - 1), reduce: 0 do
      total ->
        case move(MapSet.new(), guard_pos, {-1, 0}, Map.put(grid, {x,y}, "#"), row_len, col_len) do
          {1, _} -> total + 1
          {nil, _} -> total
          {:oob, _, _} -> total
        end
    end
    |> IO.inspect()

  end
end

AdventOfCode.Y2024.D06.solve_part1()
AdventOfCode.Y2024.D06.solve_part2()
